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
  Select,
  Button,
  Alert,
  Divider,
  Grid,
  Paper,
  Title,
} from '@mantine/core';
import { IconEye, IconEdit, IconCheck, IconX, IconAlertCircle } from '@tabler/icons-react';
import { formatRelativeTime } from '../../../../utils/formatDate';
import orderService from '../../../../services/orderService';
import { useMantineReactTable, MantineReactTable } from 'mantine-react-table';
import { useDisclosure } from '@mantine/hooks';
import toast from 'react-hot-toast';

const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded'
};

const STATUS_COLORS = {
  pending: 'orange',
  confirmed: 'blue',
  processing: 'cyan',
  shipped: 'grape',
  delivered: 'green',
  cancelled: 'red',
  refunded: 'gray'
};

const OrdersList = () => {
  const [viewModalOpen, setViewModalOpen] = useDisclosure(false);
  const [editModalOpen, setEditModalOpen] = useDisclosure(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  
  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await orderService.getOrders({
        sortBy: 'createdAt',
        sortOrder: 'desc',
        limit: 100
      });
      console.log('Orders response:', response);
      setOrders(response.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleView = useCallback((order) => {
    setSelectedOrder(order);
    setViewModalOpen.open();
  }, [setViewModalOpen]);

  const handleEdit = useCallback((order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setEditModalOpen.open();
  }, [setEditModalOpen]);

  const handleStatusUpdate = async () => {
    if (!selectedOrder || !newStatus) return;

    setIsUpdating(true);
    try {
      const response = await orderService.updateOrderStatus(selectedOrder.id, {
        status: newStatus
      });

      if (response.success) {
        toast.success('Order status updated successfully');
        setEditModalOpen.close();
        fetchOrders(); // Refresh the list
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error(error.message || 'Failed to update order status');
    } finally {
      setIsUpdating(false);
    }
  };

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

  const columns = useMemo(() => [
    {
      accessorKey: 'orderId',
      header: 'Order ID',
      size: 120,
      Cell: ({ cell }) => (
        <Text fw={600} size="sm">
          {cell.getValue()}
        </Text>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Customer Email',
      size: 200,
    },
    {
      accessorKey: 'shippingInfo.name',
      header: 'Customer Name',
      size: 150,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      size: 120,
      Cell: ({ cell }) => {
        const status = cell.getValue();
        return (
          <Badge color={STATUS_COLORS[status] || 'gray'} variant="light">
            {status?.toUpperCase()}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'paymentStatus',
      header: 'Payment',
      size: 100,
      Cell: ({ cell }) => getPaymentStatusBadge(cell.getValue()),
    },
    {
      accessorKey: 'paymentMethod',
      header: 'Payment Method',
      size: 120,
      Cell: ({ cell }) => (
        <Text tt="uppercase" size="sm">
          {cell.getValue()}
        </Text>
      ),
    },
    {
      accessorKey: 'total',
      header: 'Total',
      size: 100,
      Cell: ({ cell }) => (
        <Text fw={600}>
          {formatCurrency(cell.getValue())}
        </Text>
      ),
    },
    {
      accessorKey: 'itemCount',
      header: 'Items',
      size: 80,
      Cell: ({ cell }) => (
        <Badge variant="outline">
          {cell.getValue()}
        </Badge>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Order Date',
      size: 120,
      Cell: ({ cell }) => formatRelativeTime(cell.getValue()),
    },
  ], []);

  const table = useMantineReactTable({
    columns,
    data: orders,
    initialState: {
        showColumnFilters: false,
        columnPinning: {
          left: ['mrt-row-select', 'mrt-row-numbers'],
          right: ['mrt-row-actions'],
        },
      },
      paginationDisplayMode: 'pages',
          mantinePaginationProps: {
      radius: 'sm',
      size: 'md',
      withEdges: true,
      shape: 'rounded',
      showRowsPerPage: true,
      variant: 'light',
    },

    enableRowActions: true,
    positionActionsColumn: 'last',
    renderRowActions: ({ row }) => (
      <Group gap="xs">
        <Tooltip label="View Details">
          <ActionIcon
            variant="subtle"
            color="blue"
            onClick={() => handleView(row.original)}
          >
            <IconEye size={16} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Edit Status">
          <ActionIcon
            variant="subtle"
            color="orange"
            onClick={() => handleEdit(row.original)}
          >
            <IconEdit size={16} />
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
  });

  return (
    <Box>
      <MantineReactTable table={table} />

      {/* View Order Modal */}
      <Modal
        opened={viewModalOpen}
        onClose={setViewModalOpen.close}
        title={<Title order={3}>Order Details</Title>}
        size="lg"
      >
        {selectedOrder && (
          <Stack gap="md">
            <Grid>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">Order ID</Text>
                <Text fw={600}>{selectedOrder.orderId}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">Status</Text>
                <Badge color={STATUS_COLORS[selectedOrder.status]} variant="light">
                  {selectedOrder.status?.toUpperCase()}
                </Badge>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">Customer Email</Text>
                <Text>{selectedOrder.email}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">Customer Name</Text>
                <Text>{selectedOrder.shippingInfo?.name}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">Payment Method</Text>
                <Text tt="uppercase">{selectedOrder.paymentMethod}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">Payment Status</Text>
                {getPaymentStatusBadge(selectedOrder.paymentStatus)}
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">Total Amount</Text>
                <Text fw={600} size="lg" c="blue">
                  {formatCurrency(selectedOrder.total)}
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">Order Date</Text>
                <Text>{formatRelativeTime(selectedOrder.createdAt)}</Text>
              </Grid.Col>
            </Grid>

            <Divider />

            <Paper withBorder p="md">
              <Title order={4} mb="md">Shipping Information</Title>
              <Grid>
                <Grid.Col span={12}>
                  <Text size="sm">
                    <Text component="span" fw={600}>Address:</Text> {selectedOrder.shippingInfo?.city}, {selectedOrder.shippingInfo?.country}
                  </Text>
                </Grid.Col>
              </Grid>
            </Paper>

            <Paper withBorder p="md">
              <Title order={4} mb="md">Order Summary</Title>
              <Text>
                <Text component="span" fw={600}>Items:</Text> {selectedOrder.itemCount} items
              </Text>
              <Text>
                <Text component="span" fw={600}>Total:</Text> {formatCurrency(selectedOrder.total)}
              </Text>
            </Paper>
          </Stack>
        )}
      </Modal>

      {/* Edit Order Status Modal */}
      <Modal
        opened={editModalOpen}
        onClose={setEditModalOpen.close}
        title={<Title order={3}>Update Order Status</Title>}
        size="md"
      >
        {selectedOrder && (
          <Stack gap="md">
            <Alert icon={<IconAlertCircle size={16} />} color="blue">
              <Text size="sm">
                Updating status for order: <Text component="span" fw={600}>{selectedOrder.orderId}</Text>
              </Text>
              <Text size="sm">
                Current status: <Badge color={STATUS_COLORS[selectedOrder.status]} variant="light" size="sm">
                  {selectedOrder.status?.toUpperCase()}
                </Badge>
              </Text>
            </Alert>

            <Select
              label="New Status"
              placeholder="Select new status"
              value={newStatus}
              onChange={setNewStatus}
              data={Object.values(ORDER_STATUS).map(status => ({
                value: status,
                label: status.charAt(0).toUpperCase() + status.slice(1)
              }))}
              required
            />

            <Group justify="flex-end" gap="sm">
              <Button
                variant="outline"
                onClick={setEditModalOpen.close}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button
                onClick={handleStatusUpdate}
                loading={isUpdating}
                disabled={!newStatus || newStatus === selectedOrder.status}
                leftSection={<IconCheck size={16} />}
              >
                Update Status
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Box>
  );
};

export default OrdersList;
