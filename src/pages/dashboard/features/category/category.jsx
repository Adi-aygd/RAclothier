import { Group, Text, Button, Card, Box } from '@mantine/core';
import CategoryList from './categoryList';
import CategoryAdd from './categoryAdd';

const Category = () => {
  return (
    <Box p="md">
      <Group justify="space-between" mb="md">
        <Text size="xl" fw={700}>
          Category Management
        </Text>
        <CategoryAdd />
      </Group>
      <CategoryList />
    </Box>
  );
};

export default Category;
