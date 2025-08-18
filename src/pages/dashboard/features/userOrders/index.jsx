import { Group, Text, Box } from '@mantine/core';
import UserOrdersList from './userOrdersList';

const UserOrders = () => {
  return (
    <Box p="md">
      <Group justify="space-between" mb="md">
        <Text size="xl" fw={700}>
          My Orders
        </Text>
      </Group>
      <UserOrdersList />
    </Box>
  );
};

export default UserOrders;
