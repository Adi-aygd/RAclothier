import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Container, Paper, Title, Text, Button, Group, Stack, Alert, Box, Grid } from '@mantine/core';
import { IconCheck, IconTruckDelivery, IconMail, IconAlertCircle, IconX, IconShield } from '@tabler/icons-react';
import CryptoJS from 'crypto-js';
import useStore from '../../store/useStore';
import orderService from '../../services/orderService';

const EsewaPaymentConfirmation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearCart } = useStore();
  const [paymentStatus, setPaymentStatus] = useState('loading');
  const [orderData, setOrderData] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);

  // Function to verify eSewa payment status
  const verifyEsewaPayment = async (transaction_uuid, total_amount, product_code) => {
    try {
      const response = await fetch(
        `https://rc.esewa.com.np/api/epay/transaction/status/?product_code=${product_code}&total_amount=${total_amount}&transaction_uuid=${transaction_uuid}`
      );
      
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        throw new Error('Failed to verify payment');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      throw error;
    }
  };

  // Function to verify eSewa signature
  const verifySignature = (responseData) => {
    try {
      const secret_key = '8gBm/:&EnhH.1/q';
      const { signed_field_names, signature: receivedSignature } = responseData;
      
      // Create message from signed fields
      const fields = signed_field_names.split(',');
      const message = fields.map(field => `${field}=${responseData[field]}`).join(',');
      
      console.log('Verification message:', message);
      console.log('Received signature:', receivedSignature);
      
      // Generate signature the same way
      const hash = CryptoJS.HmacSHA256(message, secret_key);
      const generatedSignature = CryptoJS.enc.Base64.stringify(hash);
      
      console.log('Generated signature:', generatedSignature);
      
      return generatedSignature === receivedSignature;
    } catch (error) {
      console.error('Signature verification error:', error);
      return false;
    }
  };

  useEffect(() => {
    const processEsewaResponse = async () => {
      const data = searchParams.get('data');
      
      if (data) {
        try {
          // Decode base64 response from eSewa
          const decodedData = JSON.parse(atob(data));
          console.log('eSewa Response Data:', decodedData);
          
          setOrderData(decodedData);
          
          // Verify signature
          const isSignatureValid = verifySignature(decodedData);
          console.log('Signature valid:', isSignatureValid);
          
          if (!isSignatureValid) {
            setPaymentStatus('invalid_signature');
            return;
          }
          
          // Check payment status from eSewa response
          if (decodedData.status === 'COMPLETE') {
            // Create order in backend after successful payment
            const pendingOrderData = sessionStorage.getItem('pendingOrder');
            if (pendingOrderData) {
              try {
                const orderToCreate = JSON.parse(pendingOrderData);
                // Add payment details to order
                orderToCreate.transaction_uuid = decodedData.transaction_uuid;
                orderToCreate.transaction_code = decodedData.transaction_code;
                orderToCreate.ref_id = decodedData.transaction_code; // Use transaction_code as ref_id

                const response = await orderService.createOrder(orderToCreate);
                
                if (response.success) {
                  setPaymentStatus('success');
                  clearCart();
                  sessionStorage.removeItem('pendingOrder');
                  console.log('✅ Order created successfully after eSewa payment');
                } else {
                  console.error('Failed to create order:', response.message);
                  setPaymentStatus('error');
                }
              } catch (orderError) {
                console.error('Order creation error:', orderError);
                setPaymentStatus('error');
              }
            } else {
              // No pending order data, but payment successful
              setPaymentStatus('success');
              clearCart();
            }
          } else {
            setPaymentStatus('failed');
          }
        } catch (error) {
          console.error('Error processing eSewa response:', error);
          setPaymentStatus('error');
        }
      } else {
        // No eSewa data, might be a regular order confirmation
        setPaymentStatus('success');
      }
    };

    processEsewaResponse();
  }, [searchParams, clearCart]);

  const getStatusMessage = () => {
    switch (paymentStatus) {
      case 'success':
        return {
          title: 'Payment Successful!',
          message: 'Your payment of रू ' + (orderData?.total_amount || '') + ' has been processed and your order is confirmed.',
          color: 'green'
        };
      case 'failed':
        return {
          title: 'Payment Failed',
          message: 'Your payment could not be processed. Please try again.',
          color: 'red'
        };
      case 'invalid_signature':
        return {
          title: 'Security Verification Failed',
          message: 'Payment signature verification failed. Please contact support.',
          color: 'red'
        };
      case 'error':
        return {
          title: 'Processing Error',
          message: 'An error occurred while processing your payment.',
          color: 'red'
        };
      default:
        return {
          title: 'Processing Payment...',
          message: 'Please wait while we verify your payment.',
          color: 'orange'
        };
    }
  };

  const statusInfo = getStatusMessage();

  return (
    <Box mih="100vh" py="xl">
      <Container size="md">
        <Paper p="xl" radius="md">
          <Stack align="center" gap="xl">            
            <Title order={1} ta="center" c={statusInfo.color}>
              {statusInfo.title}
            </Title>
            
            <Text size="lg" ta="center" c="dimmed">
              {statusInfo.message}
            </Text>

            {paymentStatus === 'success' && (
              <Paper shadow="sm" withBorder p="xl" w="100%" radius="md">
                <Title order={2} ta="center" mb="xl">Order Details</Title>
                
                <Grid>
                  <Grid.Col span={{ base: 12, md: 4 }}>
                    <Stack align="center" gap="md">
                      <IconTruckDelivery size={40} color="#40c057" />
                      <Text fw={600}>Estimated Delivery</Text>
                      <Text c="dimmed">3-5 Business Days</Text>
                    </Stack>
                  </Grid.Col>
                  
                  <Grid.Col span={{ base: 12, md: 4 }}>
                    <Stack align="center" gap="md">
                      <IconMail size={40} color="#7c4dff" />
                      <Text fw={600}>Confirmation Email</Text>
                      <Text c="dimmed">Sent to your email</Text>
                    </Stack>
                  </Grid.Col>
                  {/* Transaction ID */}
                  {orderData?.transaction_code && (
                  <Grid.Col span={{ base: 12, md: 4 }}>
                    <Stack align="center" gap="md">
                      <IconShield size={40} color="orange" />
                      <Text fw={600}>Transaction ID</Text>
                        <Text c="dimmed">{orderData?.transaction_code}</Text>
                      </Stack>
                    </Grid.Col>
                  )}
                </Grid>
              </Paper>
            )}

            <Group justify="center" gap="md">
              <Button 
                onClick={() => navigate('/products')}
                color="dark"
                size="md"
              >
                Continue Shopping
              </Button>
              <Button 
                onClick={() => navigate('/')}
                variant="light"
                color="dark"
                size="md"
              >
                Back to Home
              </Button>
            </Group>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default EsewaPaymentConfirmation;