import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import CryptoJS from 'crypto-js';
import { 
  Container, 
  Stepper, 
  Button, 
  Group, 
  Paper, 
  Grid, 
  Box, 
  Text, 
  Title,
  Stack,
  Divider,
  ActionIcon
} from '@mantine/core';
import { IconArrowLeft, IconCreditCard, IconShield, IconTruckDelivery } from '@tabler/icons-react';

import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import useStore from '../../store/useStore';
import toast from 'react-hot-toast';
import ShippingInfo from './components/ShippingInfo';
import PaymentInfo from './components/PaymentInfo';
import OrderReview from './components/OrderReview';

// Validation schemas
const shippingSchema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  address: yup.string().required('Address is required'),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  zipCode: yup.string().required('ZIP code is required'),
  country: yup.string().required('Country is required'),
});

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, isAuthenticated, user, clearCart } = useStore();
  const [active, setActive] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('esewa');

   const tax_amount = Math.round(cartTotal * 0.1); // 10% tax rounded
   const shipping_amount = cartTotal > 500 ? 0 : 100; // Shipping cost
   const total_amount = Math.round(cartTotal + tax_amount + shipping_amount);

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    trigger
  } = useForm({
    resolver: yupResolver(shippingSchema),
    mode: 'onChange',
    defaultValues: {
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Nepal',
      orderNotes: ''
    }
  });

  const nextStep = async () => {
    if (active === 0) {
      // Validate shipping info before proceeding
      const isValid = await trigger();
      if (!isValid) {
        toast.error('Please fill in all required shipping information');
        return;
      }
    }
    
    if (active === 1 && !paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }
    
    setActive((current) => (current < 2 ? current + 1 : current));
  };

  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  const handleEsewaPayment = (total_amount) => {
    console.log('total_amount', total_amount);
    // Generate signature using HMAC SHA256 as per eSewa documentation
    const generateSignature = (total_amount, transaction_uuid, product_code) => {
      const secret_key = '8gBm/:&EnhH.1/q';
      const message = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
      
      // Generate HMAC SHA256 signature as per eSewa documentation
      const hash = CryptoJS.HmacSHA256(message, secret_key);
      const signature = CryptoJS.enc.Base64.stringify(hash);
      
      return signature;
    };

    // Use actual cart values for payment
    const transaction_uuid = `${Date.now()}`;
    const product_code = 'EPAYTEST';
    // total amount with tax and shipping is total_amount
    // const tax_amount = 
    
    const esewaConfig = {
      amount: total_amount,
      transaction_uuid: transaction_uuid,
      product_code: product_code,
      product_service_charge: 0,
      product_delivery_charge: 0,
      success_url: `${window.location.origin}/order-confirmation`,
      failure_url: `${window.location.origin}/checkout`,
      signed_field_names: 'total_amount,transaction_uuid,product_code',
      signature: generateSignature(total_amount, transaction_uuid, product_code)
    };

    // Debug log for testing
    console.log('eSewa Payment Config:', esewaConfig);
    console.log('Signature message:', `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`);
    console.log('Generated signature:', esewaConfig.signature);
    
    // Additional debugging - show the exact form data being sent
    console.log('Form data being sent to eSewa:');
    Object.keys(esewaConfig).forEach(key => {
      console.log(`${key}: ${esewaConfig[key]}`);
    });

    // Create form for eSewa payment
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';
    
    Object.keys(esewaConfig).forEach(key => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = esewaConfig[key];
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  };

  const handlePlaceOrder = async (data) => {
    try {
      if (!paymentMethod) {
        toast.error('Please select a payment method');
        return;
      }

      if (paymentMethod === 'esewa') {
        handleEsewaPayment(total_amount);
      } else if (paymentMethod === 'cod') {
        // Handle cash on delivery
        const orderData = {
          ...data,
          paymentMethod: 'cod',
          cart: cart,
          total: total,
          orderDate: new Date().toISOString(),
          status: 'pending'
        };
        
        // Here you would typically send this to your backend
        console.log('Order placed:', orderData);
        
        // Clear cart and redirect
        clearCart();
        toast.success('Order placed successfully! You will pay on delivery.');
        navigate('/order-confirmation', { state: { orderData } });
      }
    } catch (error) {
      console.error('Order placement error:', error);
      toast.error('Failed to place order. Please try again.');
    }
  };

  // Auth and cart checks
  if (!isAuthenticated) {
    return (
      <Container size="sm" mt="xl">
        <Paper p="xl" shadow="sm" radius="md">
          <Stack align="center" gap="md">
            <Title order={2}>Please sign in to checkout</Title>
            <Button onClick={() => navigate('/login')} color="dark">
            Sign In
            </Button>
          </Stack>
        </Paper>
      </Container>
    );
  }

  if (cart.length === 0) {
    return (
      <Container size="sm" mt="xl">
        <Paper p="xl" shadow="sm" radius="md">
          <Stack align="center" gap="md">
            <Title order={2}>Your cart is empty</Title>
            <Button onClick={() => navigate('/products')} color="dark">
            Continue Shopping
            </Button>
          </Stack>
        </Paper>
      </Container>
    );
  }

  return (
    <Box bg="gray.0" mih="100vh" py="xl">
      <Container size="xl">
        {/* Back Button */}
        <Group mb="xl">
          <ActionIcon
            variant="subtle"
            color="dark"
            size="lg"
          onClick={() => navigate('/cart')}
          >
            <IconArrowLeft size={20} />
          </ActionIcon>
          <Text c="dimmed">Back to Cart</Text>
        </Group>

        <Grid>
          {/* Main Content */}
          <Grid.Col span={{ base: 12, lg: 8 }}>
            <Paper p="xl" shadow="sm" radius="md">
              <Stepper 
                active={active} 
                onStepClick={setActive} 
                allowNextStepsSelect={false}
                color="dark"
                size="sm"
                mb="xl"
              >
                <Stepper.Step 
                  label="Shipping" 
                  description="Enter your shipping information"
                  icon={<IconTruckDelivery size={18} />}
                >
                  <ShippingInfo 
                    control={control} 
                    errors={errors} 
                    user={user} 
                  />
                </Stepper.Step>

                <Stepper.Step 
                  label="Payment" 
                  description="Choose payment method"
                  icon={<IconCreditCard size={18} />}
                >
                  <PaymentInfo 
                    onPaymentMethodChange={setPaymentMethod}
                    selectedPaymentMethod={paymentMethod}
                  />
                </Stepper.Step>

                <Stepper.Step 
                  label="Review" 
                  description="Review your order"
                  icon={<IconShield size={18} />}
                >
                  <OrderReview 
                    cart={cart}
                    formData={getValues()}
                    cartTotal={cartTotal}
                    tax={tax_amount}
                    shipping={shipping_amount}
                    total={total_amount}
                    paymentMethod={paymentMethod}
                  />
                </Stepper.Step>
              </Stepper>

              {/* Navigation Buttons */}
              <Group justify="space-between" mt="xl">
                <Button 
                  variant="light" 
                  color="gray"
                  onClick={prevStep}
                  disabled={active === 0}
                >
                  Previous
                </Button>

                {active < 2 ? (
                  <Button 
                    color="dark"
                    onClick={nextStep}
                  >
                    Next Step
                  </Button>
                ) : (
                  <Button 
                    color="dark"
                    onClick={handleSubmit(handlePlaceOrder)}
                    leftSection={<IconCreditCard size={16} />}
                  >
                    {paymentMethod === 'esewa' ? 'Pay with eSewa' : 
                     paymentMethod === 'cod' ? 'Place Order (COD)' : 
                     'Place Order'}
                  </Button>
                )}
              </Group>
            </Paper>
          </Grid.Col>

          {/* Order Summary Sidebar */}
          <Grid.Col span={{ base: 12, lg: 4 }}>
            <Paper p="xl" shadow="sm" radius="md" pos="sticky" top={24}>
              <Title order={3} mb="lg">Order Summary</Title>
              
              <Stack gap="md">
                <Group justify="space-between">
                  <Text>Subtotal</Text>
                  <Text fw={600}>रु {cartTotal.toFixed(2)}</Text>
                </Group>
                <Group justify="space-between">
                  <Text>Shipping</Text>
                  <Text fw={600}>{shipping_amount === 0 ? 'Free' : `${shipping_amount.toFixed(2)}`}</Text>
                </Group>
                <Group justify="space-between">
                  <Text>Tax</Text>
                  <Text fw={600}>रु {tax_amount.toFixed(2)}</Text>
                </Group>
                <Divider />
                <Group justify="space-between">
                  <Text size="lg" fw={700}>Total</Text>
                  <Text size="lg" fw={700}>रु {total_amount.toFixed(2)}</Text>
                </Group>
              </Stack>

              {/* Trust Badges */}
              <Stack gap="md" mt="xl" pt="md" style={{ borderTop: '1px solid #dee2e6' }}>
                <Group gap="sm">
                  <IconTruckDelivery size={16} color="#666" />
                  <Text size="sm" c="dimmed">Free shipping on orders over $200</Text>
                </Group>
                <Group gap="sm">
                  <IconShield size={16} color="#666" />
                  <Text size="sm" c="dimmed">Secure & encrypted checkout</Text>
                </Group>
              </Stack>
            </Paper>
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  );
};

export default Checkout;