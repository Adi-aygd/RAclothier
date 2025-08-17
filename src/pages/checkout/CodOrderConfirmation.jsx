import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Container, Paper, Title, Text, Button, Group, Stack, Alert, Box, Grid } from '@mantine/core';
import { IconTruckDelivery, IconMail, IconCash } from '@tabler/icons-react';
import useStore from '../../store/useStore';

const CodOrderConfirmation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearCart } = useStore();

  const statusInfo = {
    title: 'Order Confirmed',
    message: 'Your order has been confirmed. You will receive a confirmation email shortly.',
    color: 'green'
  };


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

                <Grid.Col span={{ base: 12, md: 4 }}>
                  <Stack align="center" gap="md">
                    <IconCash size={40} color="orange" />
                    <Text fw={600}>Cash on Delivery</Text>
                    <Text c="dimmed">You will pay on delivery</Text>
                  </Stack>
                </Grid.Col>
                  
                </Grid>
              </Paper>

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

export default CodOrderConfirmation;