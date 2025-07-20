import { Group, Text, Button, Card } from '@mantine/core';
import CategoryList from './categoryList';
import CategoryAdd from './categoryAdd';

const Category = () => {
  return (
    <div>
      <Group justify="space-between" mb="md">
        <Text size="xl" fw={700}>
          Category Management
        </Text>
        <CategoryAdd />
      </Group>
      <CategoryList />
    </div>
  );
};

export default Category;
