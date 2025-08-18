import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Box,
  Grid,
  Paper,
  Center,
  Stack,
  Badge,
  Loader,
  Alert
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { productsAPI } from '../utils/api';
import ProductCard from '../components/ProductCard';
import useStore from '../store/useStore';
import toast from 'react-hot-toast';

const Home = () => {
  const navigate = useNavigate();
  const { addToCart, isAuthenticated } = useStore();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch featured products from API
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const response = await productsAPI.getAll({featured: true });
        console.log('Featured products response:', response);
        setFeaturedProducts(response.result?.products || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching featured products:', err);
        setError(err.message || 'Failed to load featured products');
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to add items to cart');
      return;
    }

    const productToAdd = {
      ...product,
      size: product.sizes?.[0] || 'M', // Default size
      color: product.colors?.[0] || { name: 'Default', code: '#000000' } // Default color
    };

    addToCart(productToAdd);
    toast.success('Added to cart!');
  };

  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`);
  };

  return (
    <Box bg="gray.0" mih="100vh">
      {/* Hero Section */}
      <Box
        style={{
          background: 'linear-gradient(to right, #111827, #374151)',
          color: 'white',
          padding: '120px 0'
        }}
      >
        <Container size="lg">
          <Stack align="center" gap="xl">
            <Title 
              order={1} 
              size="4rem" 
              fw={700} 
              ta="center"
              style={{ 
                fontSize: 'clamp(3rem, 8vw, 5rem)',
                lineHeight: 1.1
              }}
            >
              R&A Clothier
            </Title>
            <Text 
              size="xl" 
              ta="center" 
              c="gray.3" 
              maw={600}
              style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)' }}
            >
              Where sophistication meets style. Discover our curated collection 
              of premium menswear crafted for the modern gentleman.
            </Text>
            <Group gap="md" justify="center">
              <Button 
                size="lg"
                color="white"
                c="dark"
                onClick={() => navigate('/products')}
                style={{ fontWeight: 600 }}
              >
                Explore Collection
              </Button>
              <Button 
                size="lg"
                variant="outline"
                color="white"
                c="white"
                onClick={() => navigate('/about')}
                style={{ 
                  borderColor: 'white',
                  fontWeight: 600
                }}
              >
                Our Heritage
              </Button>
            </Group>
          </Stack>
        </Container>
      </Box>

      {/* Featured Products */}
      <Container size="xl" py={80}>
        <Stack align="center" gap="xl" mb={60}>
          <Title order={2} size="3rem" fw={700} ta="center" c="dark">
            Featured Collection
          </Title>
          <Text size="xl" ta="center" c="dimmed" maw={700}>
            Handpicked pieces that embody our commitment to exceptional quality and timeless style
          </Text>
        </Stack>

        {loading ? (
          <Center py="xl">
            <Stack align="center" gap="md">
              <Loader size="lg" color="dark" />
              <Text c="dimmed">Loading featured products...</Text>
            </Stack>
          </Center>
        ) : error ? (
          <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light">
            <Text>{error}</Text>
            <Button 
              variant="light" 
              color="red" 
              size="sm" 
              mt="md"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </Alert>
        ) : featuredProducts.length === 0 ? (
          <Paper withBorder p="xl" radius="md">
            <Stack align="center" gap="md">
              <Text size="lg" c="dimmed">No featured products available</Text>
              <Button onClick={() => navigate('/products')}>
                Browse All Products
              </Button>
            </Stack>
          </Paper>
        ) : (
          <Grid>
            {featuredProducts.map(product => (
              <Grid.Col key={product.id} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
                <ProductCard 
                  product={product} 
                  onClick={() => handleProductClick(product)}
                  onAddToCart={handleAddToCart}
                />
              </Grid.Col>
            ))}
          </Grid>
        )}
      </Container>

      {/* Brand Values */}
      <Box bg="white" py={80}>
        <Container size="xl">
          <Stack align="center" gap="xl" mb={60}>
            <Title order={2} size="3rem" fw={700} ta="center" c="dark">
              The R&A Promise
            </Title>
            <Text size="xl" ta="center" c="dimmed">
              Our commitment to excellence in every detail
            </Text>
          </Stack>
          
          <Grid>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Stack align="center" gap="md">
                <Center
                  w={64}
                  h={64}
                  bg="dark"
                  style={{ borderRadius: '50%' }}
                >
                  <Text size="2rem">✨</Text>
                </Center>
                <Title order={3} size="xl" fw={700} ta="center">
                  Premium Quality
                </Title>
                <Text ta="center" c="dimmed" size="md">
                  Only the finest fabrics and materials make it into our collection, 
                  ensuring lasting quality and comfort.
                </Text>
              </Stack>
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Stack align="center" gap="md">
                <Center
                  w={64}
                  h={64}
                  bg="dark"
                  style={{ borderRadius: '50%' }}
                >
                  <Text size="2rem">✂️</Text>
                </Center>
                <Title order={3} size="xl" fw={700} ta="center">
                  Expert Tailoring
                </Title>
                <Text ta="center" c="dimmed" size="md">
                  Master craftsmen with decades of experience create each piece 
                  with meticulous attention to detail.
                </Text>
              </Stack>
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Stack align="center" gap="md">
                <Center
                  w={64}
                  h={64}
                  bg="dark"
                  style={{ borderRadius: '50%' }}
                >
                  <Text size="2rem">🎯</Text>
                </Center>
                <Title order={3} size="xl" fw={700} ta="center">
                  Perfect Fit
                </Title>
                <Text ta="center" c="dimmed" size="md">
                  Our sizing and fit are perfected through years of expertise, 
                  ensuring you look and feel your best.
                </Text>
              </Stack>
            </Grid.Col>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
