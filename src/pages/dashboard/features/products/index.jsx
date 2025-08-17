import { Group, Text } from '@mantine/core';
import ProductList from './productList';
import ProductAdd from './productAdd';

const Products = () => {
  return (
    <div>
      <Group justify="space-between" mb="md">
        <Text size="xl" fw={700}>
          Product Management
        </Text>
        <ProductAdd />
      </Group>
      <ProductList />
    </div>
  );
};

export default Products;
