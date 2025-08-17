import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Card,
  Image,
  Text,
  Title,
  Group,
  Badge,
  Button,
  Select,
  Pagination,
  Stack,
  Skeleton,
  Box,
  Paper,
  Checkbox,
  NumberInput,
  Divider,
  ActionIcon,
} from '@mantine/core';
import { IconShoppingCart } from '@tabler/icons-react';
import { productsAPI, categoriesAPI } from '../utils/api';
import placeholder from '../assets/product_placeholder.jpg';
import { useNavigate } from 'react-router-dom';
const PAGE_SIZE = 12;

const Shop = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('name');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState([]);
  // Fetch products from API
  useEffect(() => {
    setLoading(true);
    productsAPI
      .getAll({ page: pagination.page, limit: pagination.limit, sort: sortBy })
      .then((res) => {
        setProducts(res.result.products);
        setPagination(res.result.pagination);
      })
      .finally(() => setLoading(false));
  }, [pagination.page, sortBy]);

  // Fetch categories from API
  useEffect(() => {
    categoriesAPI.getAll().then((res) => {
      setCategories(res.result);
    });
  }, []);

  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter((p) => p.categoryName === selectedCategory);

  return (
    <Container size="xl" py="md">
      <Stack spacing="md">
        {/* Header */}
        <Box>
          <Title order={2}>Premium Collection</Title>
          <Text c="dimmed">Discover our finest menswear pieces</Text>
        </Box>

        {/* Sort */}
        <Group justify="flex-end" mb="md">
          <Select
            data={[
              { value: 'name', label: 'Sort by Name' },
              { value: 'price', label: 'Sort by Price' },
            ]}
            value={sortBy}
            onChange={setSortBy}
            size="sm"
            style={{ minWidth: 150 }}
          />
        </Group>

        <Grid>
          <Grid.Col span={{ xs: 12, md: 3 }}>
            <Paper p="md" withBorder={false}>
              <Text fw={600} mb="md">
                FILTER BY:
              </Text>

              {/* Price Filter */}
              <Box mb="lg">
                <Text fw={500} mb="sm">
                  Price
                </Text>
                <Group gap="xs" align="end">
                  <NumberInput label="From" placeholder="0" min={0} size="xs" w={100} />
                  <Text>-</Text>
                  <NumberInput
                    label="To"
                    placeholder="XXXX"
                    min={0}
                    size="xs"
                    w={100}
                  />
                </Group>
              </Box>
              <Divider mb="lg" />

              {/* Stock Status */}
              <Box mb="lg">
                <Text fw={500} mb="sm">
                  Stock status
                </Text>
                <Stack gap="xs">
                  <Checkbox label="In Stock" size="sm" />
                  <Checkbox label="Out Of Stock" size="sm" />
                </Stack>
              </Box>
              <Divider mb="lg" />

              {/* Category */}
              <Box mb="lg">
                <Text fw={500} mb="sm">
                  Category
                </Text>
                <Stack gap="xs">
                  {categories.map((category) => (
                    <Checkbox
                      key={category.id}
                      label={category.name}
                      size="sm"
                      checked={selectedCategory === category.name}
                      onChange={() =>
                        setSelectedCategory(
                          selectedCategory === category.name
                            ? 'All'
                            : category.name
                        )
                      }
                    />
                  ))}
                </Stack>
              </Box>
            </Paper>
          </Grid.Col>

          {/* Right Content - Products */}
          <Grid.Col span={{ xs: 12, md: 9 }}>
            {/* Products Grid */}
            {loading ? (
              <Grid gutter="md">
                {Array.from({ length: 8 }).map((_, index) => (
                  <Grid.Col key={index} span={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                    <Card
                      shadow="sm"
                      padding="lg"
                      radius="md"
                      withBorder
                      h="100%"
                    >
                      <Card.Section>
                        <Skeleton height={250} />
                      </Card.Section>
                      <Group justify="space-between" mt="md" mb="xs">
                        <Skeleton height={20} width="60%" />
                        <Skeleton height={20} width="30%" />
                      </Group>
                      <Skeleton height={16} mt="xs" />
                      <Skeleton height={16} mt="xs" width="80%" />
                      <Group justify="space-between" mt="md">
                        <Skeleton height={24} width="25%" />
                        <Skeleton height={32} width="35%" />
                      </Group>
                    </Card>
                  </Grid.Col>
                ))}
              </Grid>
            ) : (
              <Grid gutter="md">
                {filteredProducts.map((product) => (
                  <Grid.Col
                    key={product.id}
                    span={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                  >
                    <Card
                      shadow="sm"
                      padding="lg"
                      radius="md"
                      withBorder
                      h="100%"
                      style={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      <Card.Section
                        style={{
                          overflow: 'hidden',
                        }}
                      >
                        <Image
                          src={product.images?.[0] || placeholder}
                          alt={product.name}
                          h={250}
                          width="100%"
                          fit="cover"
                          radius="md"
                          style={{
                            transition: 'transform 0.3s ease-in-out',
                            ':hover': {
                              transform: 'scale(1.1)',
                            },
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'scale(1.1)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'scale(1)';
                          }}
                        />
                      </Card.Section>
                      <Group justify="space-between" mt="md">
                        <Text fw={500}>{product.name}</Text>
                        <ActionIcon variant="subtle" color="gray" size="sm">
                          <IconShoppingCart size={16} />
                        </ActionIcon>
                      </Group>
                      <Group justify="space-between">
                        <Text size="lg" fw={700} c="green">
                          रू {product.price}
                        </Text>
                      </Group>
                    </Card>
                  </Grid.Col>
                ))}
              </Grid>
            )}

            {/* Pagination */}
            <Group justify="center" mt="md">
              <Pagination
                page={pagination.page}
                onChange={(page) => setPagination((p) => ({ ...p, page }))}
                total={Math.ceil(pagination.total / pagination.limit)}
                size="sm"
                radius="md"
              />
            </Group>
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  );
};

export default Shop;
