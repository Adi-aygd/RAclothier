import React from 'react';
import { Box, Title, Group, Paper, Text, Radio, Stack, Alert } from '@mantine/core';
import { Shield, CreditCard } from 'lucide-react';

const PaymentInfo = ({ onPaymentMethodChange, selectedPaymentMethod }) => {

  return (
    <Box>
      <Title order={2} mb="lg" c="dark">
        Payment Information
      </Title>

      <Stack gap="md">
        <Radio.Group
          value={selectedPaymentMethod}
          onChange={onPaymentMethodChange}
          name="paymentMethod"
        >
          <Stack gap="md">
            <Paper 
              p="md" 
              withBorder 
              style={{ 
                border: selectedPaymentMethod === 'esewa' ? '2px solid black' : '1px solid #dee2e6',
                cursor: 'pointer'
              }}
              onClick={() => onPaymentMethodChange('esewa')}
            >
              <Group justify="space-between" align="center">
                <Group>
                  <Radio value="esewa" />
                  <Box>
                    <Text fw={500}>eSewa Digital Wallet</Text>
                    <Text size="sm" c="dimmed">
                      Pay securely with your eSewa account
                    </Text>
                  </Box>
                </Group>
                <Box style={{ width: 60, height: 30, backgroundColor: '#60c843', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Text size="xs" fw={700} c="white">eSewa</Text>
                </Box>
              </Group>
            </Paper>

            <Paper 
              p="md" 
              withBorder 
              style={{ 
                border: selectedPaymentMethod === 'card' ? '2px solid black' : '1px solid #dee2e6',
                cursor: 'pointer',
                opacity: 0.6
              }}
              onClick={() => onPaymentMethodChange('card')}
            >
              <Group justify="space-between" align="center">
                <Group>
                  <Radio value="card" disabled />
                  <Box>
                    <Text fw={500} c="dimmed">Credit/Debit Card</Text>
                    <Text size="sm" c="dimmed">
                      Coming soon - International payments
                    </Text>
                  </Box>
                </Group>
                <CreditCard size={24} color="#ccc" />
              </Group>
            </Paper>

            <Paper 
              p="md" 
              withBorder 
              style={{ 
                border: selectedPaymentMethod === 'cod' ? '2px solid black' : '1px solid #dee2e6',
                cursor: 'pointer'
              }}
              onClick={() => onPaymentMethodChange('cod')}
            >
              <Group justify="space-between" align="center">
                <Group>
                  <Radio value="cod" />
                  <Box>
                    <Text fw={500}>Cash on Delivery</Text>
                    <Text size="sm" c="dimmed">
                      Pay when your order arrives
                    </Text>
                  </Box>
                </Group>
                <Text size="lg">💴</Text>
              </Group>
            </Paper>
          </Stack>
        </Radio.Group>

        {selectedPaymentMethod === 'esewa' && (
          <Alert icon={<Shield size={16} />} title="Secure Payment" color="green">
            <Text size="sm">
              You will be redirected to eSewa's secure payment gateway after reviewing your order. This is a test environment for development purposes.
            </Text>
          </Alert>
        )}

        {selectedPaymentMethod === 'cod' && (
          <Alert icon={<Shield size={16} />} title="Cash on Delivery" color="blue">
            <Text size="sm">
              You can pay in cash when your order is delivered to your address. Please ensure you have the exact amount ready.
            </Text>
          </Alert>
        )}

        {selectedPaymentMethod === 'card' && (
          <Alert icon={<Shield size={16} />} title="Coming Soon" color="gray">
            <Text size="sm">
              Credit/Debit card payments will be available soon. Please use eSewa or Cash on Delivery for now.
            </Text>
          </Alert>
        )}

        {/* Security Features */}
        <Paper p="md" bg="gray.0">
          <Group>
            <Shield color="#22c55e" size={24} />
            <Box>
              <Text fw={600}>Secure Payment</Text>
              <Text size="sm" c="dimmed">
                Your payment information is encrypted and secure
              </Text>
            </Box>
          </Group>
        </Paper>
      </Stack>
    </Box>
  );
};

export default PaymentInfo;
