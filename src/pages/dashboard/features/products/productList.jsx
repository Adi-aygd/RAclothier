import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  ActionIcon,
  Badge,
  Modal,
  Text,
  Group,
  Image,
  Table,
  Box,
  Tooltip,
  NumberFormatter,
  Stack,
  Button,
} from '@mantine/core';
import { IconEye, IconEdit, IconTrash, IconCheck, IconX } from '@tabler/icons-react';
import toast from 'react-hot-toast';
import { formatRelativeTime } from '../../../../utils/formatDate';
import { productsAPI } from '../../../../utils/api';
import { useMantineReactTable, MantineReactTable } from 'mantine-react-table';
import { convertTextToHtmlBr } from '../../../../utils/formatString';
import ProductAdd from './productAdd';

const ProductList = () => {
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [products, setProducts] = useState([]);
  
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await productsAPI.getAll();
      console.log('Products response:', response);
      setProducts(response.result?.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleView = useCallback((product) => {
    setSelectedProduct(product);
    setViewModalOpen(true);
  }, []);

  const handleEdit = useCallback((product) => {
    setSelectedProduct(product);
    setEditModalOpen(true);
  }, []);

  const handleDelete = useCallback((product) => {
    setSelectedProduct(product);
    setDeleteModalOpen(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!selectedProduct) return;
    
    setIsDeleting(true);
    try {
      await productsAPI.delete(selectedProduct.id);
      toast.success('Product deleted successfully');
      
      // Refresh the products list
      fetchProducts();
      setDeleteModalOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error(error.message || 'Failed to delete product');
    } finally {
      setIsDeleting(false);
    }
  }, [selectedProduct, fetchProducts]);

  const handleCloseModal = useCallback(() => {
    setViewModalOpen(false);
    setSelectedProduct(null);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setEditModalOpen(false);
    setSelectedProduct(null);
  }, []);

  const handleCloseDeleteModal = useCallback(() => {
    setDeleteModalOpen(false);
    setSelectedProduct(null);
  }, []);

  const handleProductUpdated = useCallback(() => {
    fetchProducts();
    setEditModalOpen(false);
    setSelectedProduct(null);
  }, [fetchProducts]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        size: 200,
        Cell: ({ cell }) => {
          const name = cell.getValue();
          return <Text size="sm" fw={500}>{name}</Text>;
        },
      },
      {
        accessorKey: 'categoryName',
        header: 'Category',
        size: 120,
        Cell: ({ cell }) => {
          const category = cell.getValue();
          return category ? (
            <Badge variant="light" color="blue" size="sm">
              {category}
            </Badge>
          ) : (
            <Text size="sm" c="dimmed">No category</Text>
          );
        },
      },
      {
        accessorKey: 'price',
        header: 'Price',
        size: 100,
        Cell: ({ cell }) => (
          <NumberFormatter
            value={cell.getValue()}
            prefix="रू "
            thousandSeparator
            decimalScale={2}
          />
        ),
      },
      {
        accessorKey: 'originalPrice',
        header: 'Original Price',
        size: 120,
        Cell: ({ cell }) => {
          const originalPrice = cell.getValue();
          return originalPrice ? (
            <NumberFormatter
              value={originalPrice}
              prefix="रू "
              thousandSeparator
              decimalScale={2}
            />
          ) : (
            <Text size="sm" c="dimmed">-</Text>
          );
        },
      },
      {
        accessorKey: 'stock',
        header: 'Stock',
        size: 80,
        Cell: ({ cell }) => {
          const stock = cell.getValue();
          return (
            <Badge
              color={stock > 10 ? 'green' : stock > 0 ? 'yellow' : 'red'}
              variant="light"
            >
              {stock}
            </Badge>
          );
        },
      },
      {
        accessorKey: 'isActive',
        header: 'Status',
        size: 100,
        Cell: ({ cell }) => (
          <Badge color={cell.getValue() ? 'green' : 'red'} variant="light">
            {cell.getValue() ? 'Active' : 'Inactive'}
          </Badge>
        ),
      },
      {
        accessorKey: 'featured',
        header: 'Featured',
        size: 100,
        Cell: ({ cell }) => (
          <Badge color={cell.getValue() ? 'orange' : 'gray'} variant="light">
            {cell.getValue() ? 'Yes' : 'No'}
          </Badge>
        ),
      },
    ],
    []
  );

  const table = useMantineReactTable({
    columns,
    data: products,
    initialState: {
      showColumnFilters: false,
      columnPinning: {
        left: ['mrt-row-select', 'mrt-row-numbers'],
        right: ['mrt-row-actions'],
      },
    },
    state: {
      isLoading,
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
    renderRowActions: ({ row }) => {
      return (
        <Group gap="xs" wrap="nowrap">
          <Tooltip label="View Details">
            <ActionIcon
              size="sm"
              variant="subtle"
              color="blue"
              onClick={() => handleView(row.original)}
            >
              <IconEye size={16} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Edit">
            <ActionIcon
              size="sm"
              variant="subtle"
              color="orange"
              onClick={() => handleEdit(row.original)}
            >
              <IconEdit size={16} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Delete">
            <ActionIcon
              size="sm"
              variant="subtle"
              color="red"
              onClick={() => handleDelete(row.original)}
            >
              <IconTrash size={16} />
            </ActionIcon>
          </Tooltip>
        </Group>
      );
    },
  });

  return (
    <>
      <MantineReactTable table={table} />

      {/* View Modal */}
      <Modal
        opened={viewModalOpen}
        onClose={handleCloseModal}
        title="Product Details"
        size="lg"
      >
        {selectedProduct && (
          <div>
            {/* Product Images */}
            {selectedProduct.images && selectedProduct.images.length > 0 && (
              <Group justify="center" mb="md">
                <Image
                  src={selectedProduct.images[0]}
                  alt={selectedProduct.name}
                  width={300}
                  height={200}
                  fit="cover"
                  radius="md"
                />
              </Group>
            )}

            <Table>
              <Table.Tbody>
                <Table.Tr>
                  <Table.Td style={{ fontWeight: 600 }}>Name:</Table.Td>
                  <Table.Td>{selectedProduct.name}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td style={{ fontWeight: 600 }}>Description:</Table.Td>
                  <Table.Td><Text dangerouslySetInnerHTML={{ __html: convertTextToHtmlBr(selectedProduct.description) }} /></Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td style={{ fontWeight: 600 }}>Category:</Table.Td>
                  <Table.Td>
                    {selectedProduct.categoryName ? (
                      <Badge variant="light" color="blue">
                        {selectedProduct.categoryName}
                      </Badge>
                    ) : (
                      <Text c="dimmed">No category</Text>
                    )}
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td style={{ fontWeight: 600 }}>Price:</Table.Td>
                  <Table.Td>
                    <NumberFormatter
                      value={selectedProduct.price}
                      prefix="रू "
                      thousandSeparator
                      decimalScale={2}
                    />
                  </Table.Td>
                </Table.Tr>
                {selectedProduct.originalPrice && (
                  <Table.Tr>
                    <Table.Td style={{ fontWeight: 600 }}>Original Price:</Table.Td>
                    <Table.Td>
                      <NumberFormatter
                        value={selectedProduct.originalPrice}
                        prefix="रू "
                        thousandSeparator
                        decimalScale={2}
                      />
                    </Table.Td>
                  </Table.Tr>
                )}
                <Table.Tr>
                  <Table.Td style={{ fontWeight: 600 }}>Stock:</Table.Td>
                  <Table.Td>
                    <Badge
                      color={selectedProduct.stock > 10 ? 'green' : selectedProduct.stock > 0 ? 'yellow' : 'red'}
                      variant="light"
                    >
                      {selectedProduct.stock} units
                    </Badge>
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td style={{ fontWeight: 600 }}>Status:</Table.Td>
                  <Table.Td>
                    <Badge
                      color={selectedProduct.isActive ? 'green' : 'red'}
                      variant="light"
                    >
                      {selectedProduct.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td style={{ fontWeight: 600 }}>Featured:</Table.Td>
                  <Table.Td>
                    <Badge
                      color={selectedProduct.featured ? 'orange' : 'gray'}
                      variant="light"
                    >
                      {selectedProduct.featured ? 'Yes' : 'No'}
                    </Badge>
                  </Table.Td>
                </Table.Tr>
                {selectedProduct?.sizes && selectedProduct.sizes.length > 0 && (
                  <Table.Tr>
                    <Table.Td style={{ fontWeight: 600 }}>Sizes:</Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        {selectedProduct.sizes.map((size, index) => (
                          <Badge key={index} variant="outline" size="sm">
                            {size}
                          </Badge>
                        ))}
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                )}
                {selectedProduct?.colors && selectedProduct.colors.length > 0 && (
                  <Table.Tr>
                    <Table.Td style={{ fontWeight: 600 }}>Colors:</Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        {selectedProduct.colors.map((color, index) => (
                          <Badge key={index} variant="outline" size="sm">
                            {typeof color === 'string' ? color : color.name}
                          </Badge>
                        ))}
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                )}
                <Table.Tr>
                  <Table.Td style={{ fontWeight: 600 }}>Created:</Table.Td>
                  <Table.Td>
                    {formatRelativeTime(selectedProduct.createdAt)}
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td style={{ fontWeight: 600 }}>Updated:</Table.Td>
                  <Table.Td>
                    {formatRelativeTime(selectedProduct.updatedAt)}
                  </Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        opened={editModalOpen}
        onClose={handleCloseEditModal}
        title={`Edit Product - ${selectedProduct?.name || ''}`}
        size="xl"
      >
        {selectedProduct && (
          <ProductAdd
            editMode={true}
            productData={selectedProduct}
            onProductUpdated={handleProductUpdated}
            onCancel={handleCloseEditModal}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        opened={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        title="Delete Product"
        size="md"
      >
        <Stack>
          <Text>
            Are you sure you want to delete <strong>{selectedProduct?.name}</strong>?
            This action cannot be undone.
          </Text>
          
          <Group justify="flex-end" mt="md">
            <Button
              variant="light"
              onClick={handleCloseDeleteModal}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              color="red"
              onClick={confirmDelete}
              loading={isDeleting}
              leftSection={<IconTrash size={16} />}
            >
              Delete Product
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};

export default ProductList; 