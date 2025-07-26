import React, { useEffect, useState } from 'react';
import {
  Container, Grid, Card, Image, Text, Title, Group, Badge, Button, Select, Pagination, Stack, Loader, Box, Paper
} from '@mantine/core';
import { IconStar, IconShoppingCart } from '@tabler/icons-react';
import { productsAPI, categoriesAPI } from '../utils/api';
import placeholder from '../assets/product_placeholder.jpg'
const PAGE_SIZE = 12;

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: PAGE_SIZE, total: 0 });
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('name');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState([]);
  // Fetch products from API
  useEffect(() => {
    setLoading(true);
    productsAPI.getAll({ page: pagination.page, limit: pagination.limit, sort: sortBy })
      .then(res => {
        setProducts(res.result.products);
        setPagination(res.result.pagination);
      })
      .finally(() => setLoading(false));
  }, [pagination.page, sortBy]);

  // Fetch categories from API
  useEffect(() => {
    categoriesAPI.getAll()
      .then(res => {
        setCategories(res.result);
      });
  }, []);
  


  // Filter products by category (client-side, or use API param)
  const filteredProducts = category === 'All'
    ? products
    : products.filter(p => p.categoryName === category);

  return (
    <Container size="xl" py="md">
      <Stack spacing="md">
        {/* Header */}
        <Box>
          <Title order={2}>Premium Collection</Title>
          <Text color="dimmed">Discover our finest menswear pieces</Text>
        </Box>

        {/* Filters and Sort */}
        <Group position="apart" spacing="xs" wrap="wrap">
          <Group spacing="xs">
            <Select
              data={categories.map(category => ({ value: category.id, label: category.name }))}
              value={selectedCategory}
              onChange={value => setSelectedCategory(value)}
              label="Category"
              size="sm"
              style={{ minWidth: 150 }}
            />
          </Group>
          <Select
            data={[
              { value: 'name', label: 'Sort by Name' },
              { value: 'price', label: 'Sort by Price' },
              { value: 'rating', label: 'Sort by Rating' },
            ]}
            value={sortBy}
            onChange={setSortBy}
            size="sm"
            style={{ minWidth: 150 }}
          />
        </Group>

        {/* Products Grid */}
        {loading ? (
          <Group position="center" py="xl">
            <Loader />
          </Group>
        ) : (
          <Grid gutter="md">
            {filteredProducts.map(product => (
              <Grid.Col key={product.id} span={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Card.Section>
                    <Image
                      src={product.images?.[0] || placeholder}
                      alt={product.name}
                      height={60}
                      fit="contain"
                      radius="md"
                    />
                  </Card.Section>
                  <Group position="apart" mt="md" mb="xs">
                    <Text weight={500}>{product.name}</Text>
                    {product.featured && <Badge color="yellow">Featured</Badge>}
                  </Group>
                  <Text size="sm" c="dimmed" lineClamp={2}>
                    {product.description}
                  </Text>
                  <Group spacing="xs" mt="xs">
                    <IconStar size={16} color="gold" />
                    <Text size="xs">{product.rating || '—'}</Text>
                  </Group>
                  <Group position="apart" mt="md">
                    <Text size="lg" weight={700}>${product.price}</Text>
                    <Button leftIcon={<IconShoppingCart size={16} />} size="xs" variant="light">
                      Add to Cart
                    </Button>
                  </Group>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        )}

        {/* Pagination */}
        <Group position="center" mt="md">
          <Pagination
            page={pagination.page}
            onChange={page => setPagination(p => ({ ...p, page }))}
            total={Math.ceil(pagination.total / pagination.limit)}
            size="sm"
            radius="md"
          />
        </Group>
      </Stack>
    </Container>
  );
};

export default Shop;
