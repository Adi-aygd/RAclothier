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
} from '@mantine/core';
import { IconEye, IconEdit, IconTrash } from '@tabler/icons-react';
import { formatRelativeTime } from '../../../../utils/formatDate';
import { categoriesAPI } from '../../../../utils/api';
import { useMantineReactTable, MantineReactTable } from 'mantine-react-table';

const CategoryList = () => {
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await categoriesAPI.getAll();
      console.log('Categories response:', response.result);
      setCategories(response.result || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleView = useCallback((category) => {
    setSelectedCategory(category);
    setViewModalOpen(true);
  }, []);

  const handleEdit = useCallback((category) => {
    console.log('Edit category:', category);
    // TODO: Implement edit functionality
  }, []);

  const handleDelete = useCallback((category) => {
    console.log('Delete category:', category);
    // TODO: Implement delete functionality
  }, []);

  const handleCloseModal = useCallback(() => {
    setViewModalOpen(false);
    setSelectedCategory(null);
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        Cell: ({ cell }) => {
          const name = cell.getValue();
          return <Text size="sm">{name}</Text>;
        },
      },
      {
        accessorKey: 'description',
        header: 'Description',
        size: 300,
        Cell: ({ cell }) => {
          const description = cell.getValue();
          return description.length > 30 ? (
            <Tooltip label={description}>
              <Box>{description.substring(0, 30)}...</Box>
            </Tooltip>
          ) : (
            <Text size="sm">{description}</Text>
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
    ],
    []
  );

  const table = useMantineReactTable({
    columns,
    data: categories,
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
        title="Category Details"
        size="md"
      >
        {selectedCategory && (
          <div>
            {selectedCategory.image && (
              <Group justify="center" mb="md">
                <Image
                  src={selectedCategory.image}
                  alt={selectedCategory.name}
                  width={200}
                  height={150}
                  fit="cover"
                  radius="md"
                />
              </Group>
            )}

            <Table>
              <Table.Tbody>
                <Table.Tr>
                  <Table.Td style={{ fontWeight: 600 }}>Name:</Table.Td>
                  <Table.Td>{selectedCategory.name}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td style={{ fontWeight: 600 }}>Description:</Table.Td>
                  <Table.Td>{selectedCategory.description}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td style={{ fontWeight: 600 }}>Status:</Table.Td>
                  <Table.Td>
                    <Badge
                      color={selectedCategory.isActive ? 'green' : 'red'}
                      variant="light"
                    >
                      {selectedCategory.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td style={{ fontWeight: 600 }}>Created:</Table.Td>
                  <Table.Td>
                    {formatRelativeTime(selectedCategory.createdAt)}
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td style={{ fontWeight: 600 }}>Updated:</Table.Td>
                  <Table.Td>
                    {formatRelativeTime(selectedCategory.updatedAt)}
                  </Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </div>
        )}
      </Modal>
    </>
  );
};

export default CategoryList;
