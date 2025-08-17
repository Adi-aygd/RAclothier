import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
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

  const handlePlaceOrder = async (data) => {
    try {
      if (!paymentMethod) {
        toast.error('Please select a payment method');
        return;
      }

      // Handle different payment methods
      if (paymentMethod === 'esewa') {
        // eSewa payment will be handled in PaymentInfo component
        // const total = calculateTotal();
        const total =5; // TODO; remove this. testing for now.
        handleEsewaPayment(total);
      } else if (paymentMethod === 'cod') {
        // Handle cash on delivery
        const orderData = {
          ...data,
          paymentMethod: 'cod',
          cart: cart,
          total: calculateTotal(),
          orderDate: new Date().toISOString(),
          status: 'pending'
        };
        
        // Here you would typically send this to your backend
        console.log('Order placed:', orderData);
        
        // Clear cart and redirect
        // clearCart();
        toast.success('Order placed successfully! You will pay on delivery.');
        navigate('/order-confirmation', { state: { orderData } });
      }
    } catch (error) {
      console.error('Order placement error:', error);
      toast.error('Failed to place order. Please try again.');
    }
  };

  const handleEsewaPayment = (total) => {
    // eSewa test configuration
    const esewaConfig = {
      amt: total,
      pdc: 0,
      psc: 0,
      txAmt: 0,
      tAmt: total,
      pid: `RACLOTHIER-${Date.now()}`, // Unique product ID
      scd: 'EPAYTEST', // eSewa test merchant code
      su: `${window.location.origin}/order-confirmation`, // Success URL
      fu: `${window.location.origin}/checkout`, // Failure URL
    };

    // Create form for eSewa payment
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://uat.esewa.com.np/epay/main'; // Test URL
    
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

  const calculateTotal = () => {
    const tax = cartTotal * 0.1;
    const shipping = cartTotal > 200 ? 0 : 25;
    return cartTotal + tax + shipping;
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

  const tax = cartTotal * 0.1;
  const shipping = cartTotal > 200 ? 0 : 25;
  const total = cartTotal + tax + shipping;

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
                    tax={tax}
                    shipping={shipping}
                    total={total}
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
                  <Text fw={600}>{shipping === 0 ? 'Free' : `${shipping.toFixed(2)}`}</Text>
                </Group>
                <Group justify="space-between">
                  <Text>Tax</Text>
                  <Text fw={600}>रु {tax.toFixed(2)}</Text>
                </Group>
                <Divider />
                <Group justify="space-between">x
                  <Text size="lg" fw={700}>Total</Text>
                  <Text size="lg" fw={700}>रु {total.toFixed(2)}</Text>
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