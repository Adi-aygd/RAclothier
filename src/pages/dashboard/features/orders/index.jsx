import { Group, Text, Box } from '@mantine/core';
import OrdersList from './ordersList';

const Orders = () => {
  return (
    <Box p="md">
      <Group justify="space-between" mb="md">
        <Text size="xl" fw={700}>
          Orders Management
        </Text>
      </Group>
      <OrdersList />
    </Box>
  );
};

export default Orders;
