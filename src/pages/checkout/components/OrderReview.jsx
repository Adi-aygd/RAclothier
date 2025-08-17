import React from 'react';
import { Box, Title, Stack, Group, Image, Text, Paper, Divider } from '@mantine/core';
import placeholder from '../../../assets/product_placeholder.jpg';
const OrderReview = ({ cart, formData, cartTotal, tax, shipping, total, paymentMethod }) => {
  const getPaymentMethodDisplay = (method) => {
    switch (method) {
      case 'esewa':
        return 'eSewa Digital Wallet';
      case 'cod':
        return 'Cash on Delivery';
      case 'card':
        return 'Credit/Debit Card';
      default:
        return 'Not selected';
    }
  };

  return (
    <Box>
      <Title order={2} mb="lg" c="dark">
        Review Your Order
      </Title>

      <Stack gap="lg">
        {/* Order Items */}
        <Paper p="md" withBorder>
          <Title order={4} mb="md">Order Items</Title>
          <Stack gap="md">
            {cart.map((item, index) => (
              <Group key={index} align="flex-start" gap="md">
                <Image
                  src={item?.images?.[0] || placeholder}
                  alt={item.name}
                  w={80}
                  h={80}
                  fit="cover"
                  radius="md"
                />
                <Box flex={1}>
                  <Text fw={600}>{item.name}</Text>
                  <Text size="sm" c="dimmed">
                    Size: {item?.size || '-'} | Color: {item?.color || '-'}
                  </Text>
                  <Text size="sm" c="dimmed">Quantity: {item.quantity}</Text>
                </Box>
                <Text fw={600}>रु {(item.price * item.quantity).toFixed(2)}</Text>
              </Group>
            ))}
          </Stack>
        </Paper>

        {/* Shipping Information */}
        <Paper p="md" withBorder>
          <Title order={4} mb="md">Shipping Information</Title>
          <Stack gap="xs">
            <Text>
              <Text component="span" fw={600}>Name:</Text> {formData.firstName} {formData.lastName}
            </Text>
            <Text>
              <Text component="span" fw={600}>Email:</Text> {formData.email}
            </Text>
            <Text>
              <Text component="span" fw={600}>Phone:</Text> {formData.phone}
            </Text>
            <Text>
              <Text component="span" fw={600}>Address:</Text> {formData.address}
            </Text>
            <Text>
              <Text component="span" fw={600}>City:</Text> {formData.city}, {formData.state} {formData.zipCode}
            </Text>
            <Text>
              <Text component="span" fw={600}>Country:</Text> {formData.country}
            </Text>
          </Stack>
        </Paper>

        {/* Payment Information */}
        <Paper p="md" withBorder>
          <Title order={4} mb="md">Payment Method</Title>
          <Text fw={600}>{getPaymentMethodDisplay(paymentMethod)}</Text>
          {paymentMethod === 'esewa' && (
            <Text size="sm" c="dimmed" mt="xs">
              You will be redirected to eSewa for secure payment processing
            </Text>
          )}
          {paymentMethod === 'cod' && (
            <Text size="sm" c="dimmed" mt="xs">
              Pay in cash when your order is delivered
            </Text>
          )}
        </Paper>

        {/* Order Summary */}
        <Paper p="md" withBorder>
          <Title order={4} mb="md">Order Summary</Title>
          <Stack gap="xs">
            <Group justify="space-between">
              <Text>Subtotal</Text>
              <Text>रु {cartTotal.toFixed(2)}</Text>
            </Group>
            <Group justify="space-between">
              <Text>Shipping</Text>
              <Text>{shipping === 0 ? 'Free' : `रु ${shipping.toFixed(2)}`}</Text>
            </Group>
            <Group justify="space-between">
              <Text>Tax</Text>
              <Text>रु {tax.toFixed(2)}</Text>
            </Group>
            <Divider />
            <Group justify="space-between">
              <Text fw={700} size="lg">Total</Text>
              <Text fw={700} size="lg">रु {total.toFixed(2)}</Text>
            </Group>
          </Stack>
        </Paper>

        {/* Order Notes */}
        {formData.orderNotes && (
          <Paper p="md" withBorder>
            <Title order={4} mb="md">Order Notes</Title>
            <Text>{formData.orderNotes}</Text>
          </Paper>
        )}
      </Stack>
    </Box>
  );
};

export default OrderReview;
