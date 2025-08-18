import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  ActionIcon,
  Badge,
  Modal,
  Text,
  Group,
  Stack,
  Box,
  Tooltip,
  Divider,
  Grid,
  Paper,
  Title,
  Alert,
  Button,
} from '@mantine/core';
import { IconEye, IconAlertCircle, IconShoppingBag } from '@tabler/icons-react';
import { formatRelativeTime } from '../../../../utils/formatDate';
import orderService from '../../../../services/orderService';
import { useMantineReactTable, MantineReactTable } from 'mantine-react-table';
import { useDisclosure } from '@mantine/hooks';
import useStore from '../../../../store/useStore';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  pending: 'orange',
  confirmed: 'blue',
  processing: 'cyan',
  shipped: 'grape',
  delivered: 'green',
  cancelled: 'red',
  refunded: 'gray'
};

const UserOrdersList = () => {
  const { user } = useStore();
  const [viewModalOpen, setViewModalOpen] = useDisclosure(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  
  const fetchUserOrders = useCallback(async () => {
    if (!user?.uid) {
      console.warn('No user ID available');
      return;
    }

    setIsLoading(true);
    try {
      const response = await orderService.getUserOrders(user.uid, {
        sortBy: 'createdAt',
        sortOrder: 'desc',
        limit: 50
      });
      console.log('User orders response:', response);
      setOrders(response.orders || []);
    } catch (error) {
      console.error('Error fetching user orders:', error);
      toast.error('Failed to fetch your orders');
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    fetchUserOrders();
  }, [fetchUserOrders]);

  const handleView = useCallback((order) => {
    setSelectedOrder(order);
    setViewModalOpen.open();
  }, [setViewModalOpen]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getPaymentStatusBadge = (paymentStatus) => {
    const colors = {
      paid: 'green',
      pending: 'orange',
      failed: 'red'
    };
    return (
      <Badge color={colors[paymentStatus] || 'gray'} variant="light">
        {paymentStatus?.toUpperCase() || 'UNKNOWN'}
      </Badge>
    );
  };

  const getStatusDescription = (status) => {
    const descriptions = {
      pending: 'Your order is being processed',
      confirmed: 'Your order has been confirmed',
      processing: 'Your order is being prepared',
      shipped: 'Your order is on the way',
      delivered: 'Your order has been delivered',
      cancelled: 'Your order has been cancelled',
      refunded: 'Your order has been refunded'
    };
    return descriptions[status] || 'Status unknown';
  };

  const columns = useMemo(() => [
    {
      accessorKey: 'orderId',
      header: 'Order ID',
      size: 140,
      Cell: ({ cell }) => (
        <Text fw={600} size="sm" c="blue">
          {cell.getValue()}
        </Text>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      size: 120,
      Cell: ({ cell }) => {
        const status = cell.getValue();
        return (
          <Group gap="xs">
            <Badge color={STATUS_COLORS[status] || 'gray'} variant="light">
              {status?.toUpperCase()}
            </Badge>
          </Group>
        );
      },
    },
    {
      accessorKey: 'paymentMethod',
      header: 'Payment',
      size: 100,
      Cell: ({ cell }) => (
        <Text tt="uppercase" size="sm">
          {cell.getValue()}
        </Text>
      ),
    },
    {
      accessorKey: 'paymentStatus',
      header: 'Payment Status',
      size: 120,
      Cell: ({ cell }) => getPaymentStatusBadge(cell.getValue()),
    },
    {
      accessorKey: 'total',
      header: 'Total',
      size: 100,
      Cell: ({ cell }) => (
        <Text fw={600} c="green">
          {formatCurrency(cell.getValue())}
        </Text>
      ),
    },
    {
      accessorKey: 'itemCount',
      header: 'Items',
      size: 80,
      Cell: ({ cell }) => (
        <Badge variant="outline" leftSection={<IconShoppingBag size={12} />}>
          {cell.getValue()}
        </Badge>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Order Date',
      size: 120,
      Cell: ({ cell }) => (
        <Text size="sm">
          {formatRelativeTime(cell.getValue())}
        </Text>
      ),
    },
  ], []);

  const table = useMantineReactTable({
    columns,
    data: orders,
    enableRowActions: true,
    positionActionsColumn: 'last',
    renderRowActions: ({ row }) => (
      <Group gap="xs">
        <Tooltip label="View Order Details">
          <ActionIcon
            variant="subtle"
            color="blue"
            onClick={() => handleView(row.original)}
          >
            <IconEye size={16} />
          </ActionIcon>
        </Tooltip>
      </Group>
    ),
    state: {
      isLoading,
    },
    mantineTableProps: {
      striped: true,
      highlightOnHover: true,
    },
    renderEmptyRowsFallback: () => (
      <Stack align="center" gap="md" p="xl">
        <IconShoppingBag size={48} color="gray" />
        <Text size="lg" c="dimmed">No orders found</Text>
        <Text size="sm" c="dimmed" ta="center">
          You haven't placed any orders yet. Start shopping to see your orders here!
        </Text>
        <Button onClick={() => window.location.href = '/products'} variant="light">
          Start Shopping
        </Button>
      </Stack>
    ),
  });

  return (
    <Box>
      {!user?.uid && (
        <Alert icon={<IconAlertCircle size={16} />} color="red" mb="md">
          Please log in to view your orders.
        </Alert>
      )}
      
      <MantineReactTable table={table} />

      {/* View Order Details Modal */}
      <Modal
        opened={viewModalOpen}
        onClose={setViewModalOpen.close}
        title={<Title order={3}>Order Details</Title>}
        size="lg"
      >
        {selectedOrder && (
          <Stack gap="md">
            {/* Order Header */}
            <Paper withBorder p="md" bg="blue.0">
              <Grid>
                <Grid.Col span={6}>
                  <Text size="sm" c="dimmed">Order ID</Text>
                  <Text fw={600} size="lg">{selectedOrder.orderId}</Text>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Text size="sm" c="dimmed">Status</Text>
                  <Group gap="xs">
                    <Badge color={STATUS_COLORS[selectedOrder.status]} variant="filled" size="lg">
                      {selectedOrder.status?.toUpperCase()}
                    </Badge>
                  </Group>
                  <Text size="xs" c="dimmed" mt="xs">
                    {getStatusDescription(selectedOrder.status)}
                  </Text>
                </Grid.Col>
              </Grid>
            </Paper>

            {/* Order Information */}
            <Grid>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">Order Date</Text>
                <Text fw={500}>{formatRelativeTime(selectedOrder.createdAt)}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">Last Updated</Text>
                <Text fw={500}>{formatRelativeTime(selectedOrder.updatedAt)}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">Payment Method</Text>
                <Text tt="uppercase" fw={500}>{selectedOrder.paymentMethod}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">Payment Status</Text>
                {getPaymentStatusBadge(selectedOrder.paymentStatus)}
              </Grid.Col>
            </Grid>

            <Divider />

            {/* Shipping Information */}
            <Paper withBorder p="md">
              <Title order={4} mb="md">Shipping Information</Title>
              <Grid>
                <Grid.Col span={12}>
                  <Text>
                    <Text component="span" fw={600}>Deliver to:</Text> {selectedOrder.shippingInfo?.name}
                  </Text>
                  <Text>
                    <Text component="span" fw={600}>Location:</Text> {selectedOrder.shippingInfo?.city}, {selectedOrder.shippingInfo?.country}
                  </Text>
                </Grid.Col>
              </Grid>
            </Paper>

            {/* Order Summary */}
            <Paper withBorder p="md">
              <Title order={4} mb="md">Order Summary</Title>
              <Group justify="space-between">
                <Text>
                  <Text component="span" fw={600}>Items:</Text> {selectedOrder.itemCount} items
                </Text>
                <Text fw={600} size="lg" c="green">
                  Total: {formatCurrency(selectedOrder.total)}
                </Text>
              </Group>
            </Paper>

            {/* Order Status Timeline (if shipped or delivered) */}
            {['shipped', 'delivered'].includes(selectedOrder.status) && (
              <Paper withBorder p="md" bg="green.0">
                <Title order={4} mb="md">Delivery Information</Title>
                <Text size="sm">
                  Expected delivery: 3-5 business days from order confirmation
                </Text>
                {selectedOrder.status === 'delivered' && (
                  <Alert color="green" mt="md">
                    <Text size="sm" fw={600}>
                      Your order has been successfully delivered!
                    </Text>
                  </Alert>
                )}
              </Paper>
            )}

            {/* Actions */}
            <Group justify="flex-end">
              <Button variant="outline" onClick={setViewModalOpen.close}>
                Close
              </Button>
              {selectedOrder.status === 'pending' && (
                <Button color="red" variant="light">
                  Cancel Order
                </Button>
              )}
            </Group>
          </Stack>
        )}
      </Modal>
    </Box>
  );
};

export default UserOrdersList;
