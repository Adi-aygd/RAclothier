// src/components/ProductCard.jsx
import React from 'react';
import { Card, Image, Text, Group, ActionIcon } from '@mantine/core';
import { IconShoppingCart } from '@tabler/icons-react';
import placeholder from '../assets/product_placeholder.jpg';

const ProductCard = ({ product, onClick, onAddToCart }) => {
  return (
    <Card
      shadow="sm"
      p="lg"
      h="100%"
      radius="md"
      withBorder
      style={{ cursor: 'pointer' }}
      onClick={onClick}
    >
      <Card.Section style={{ overflow: 'hidden' }}>
        <Image
          src={product?.images?.[0] || placeholder}
          alt={product?.name}
          h={250}
          width="100%"
          fit="cover"
          radius="md"
          style={{
            transition: 'transform 0.3s ease-in-out',
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
        <Text fw={500}>{product?.name}</Text>
        {onAddToCart && (
          <ActionIcon 
            variant="subtle" 
            color="gray" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
          >
            <IconShoppingCart size={16} />
          </ActionIcon>
        )}
      </Group>
      <Group justify="space-between">
        <Text size="lg" fw={700} c="green">
          रू {product?.price}
        </Text>
      </Group>
    </Card>
  );
};

export default ProductCard;