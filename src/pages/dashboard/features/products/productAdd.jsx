import React, { useState, useEffect } from 'react';
import {
  Button,
  Modal,
  TextInput,
  Textarea,
  Switch,
  Grid,
  Group,
  Image,
  FileInput,
  Stack,
  Text,
  NumberInput,
  Select,
  TagsInput,
  Divider,
} from '@mantine/core';
import { IconPlus, IconUpload, IconX } from '@tabler/icons-react';
import { categoriesAPI } from '../../../../utils/api';
import { productsAPI } from '../../../../utils/api';
const ProductAdd = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    categoryId: '',
    stock: 0,
    isActive: true,
    featured: false,
    sizes: [],
    colors: [],
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoriesAPI.getAll();
        const categoryOptions = response.result.map((category) => ({
          value: category.id,
          label: category.name,
        }));
        setCategories(categoryOptions);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Removed predefined size options - now using TagsInput for custom sizes

  const handleImagesChange = (files) => {
    if (files && files.length > 0) {
      const newImages = Array.from(files);
      setImages(prev => [...prev, ...newImages]);
      
      // Generate previews
      newImages.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreviews(prev => [...prev, {
            file: file,
            url: e.target.result,
            name: file.name
          }]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create FormData for multipart form
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('stock', formData.stock);
      formDataToSend.append('isActive', formData.isActive);
      formDataToSend.append('featured', formData.featured);

      if (formData.originalPrice) {
        formDataToSend.append('originalPrice', formData.originalPrice);
      }

      if (formData.categoryId) {
        formDataToSend.append('categoryId', formData.categoryId);
      }

      if (formData.sizes.length > 0) {
        formDataToSend.append('sizes', JSON.stringify(formData.sizes));
      }

      if (formData.colors.length > 0) {
        formDataToSend.append('colors', JSON.stringify(formData.colors));
      }

      // Append images
      images.forEach((image) => {
        formDataToSend.append('images', image);
      });

      console.log('Creating product with data:', {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        originalPrice: formData.originalPrice,
        categoryId: formData.categoryId,
        stock: formData.stock,
        isActive: formData.isActive,
        featured: formData.featured,
        sizes: formData.sizes,
        colors: formData.colors,
        images: images.map(img => img.name),
      });

      const result = await productsAPI.create(formDataToSend);

      if (response.ok) {
        console.log('Product created successfully:', result);
        // Reset form and close modal
        handleCancel();
      } else {
        console.error('Error creating product:', result);
        alert(`Error creating product: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error creating product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      categoryId: '',
      stock: 0,
      isActive: true,
      featured: false,
      sizes: [],
      colors: [],
    });
    setImages([]);
    setImagePreviews([]);
    setModalOpen(false);
  };

  const handleOpenModal = () => {
    setModalOpen(true);
    console.log('Modal opened');
  };

  return (
    <>
      <Button
        leftSection={<IconPlus size={16} />}
        onClick={handleOpenModal}
      >
        Add Product
      </Button>

      <Modal
        opened={modalOpen}
        onClose={handleCancel}
        title="Add New Product"
        size="xl"
      >
        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <Text size="lg" fw={600}>Basic Information</Text>
            
            <Grid>
              <Grid.Col span={{ base: 12, sm: 8 }}>
                <TextInput
                  label="Product Name"
                  placeholder="Enter product name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 4 }}>
                <Select
                  label="Category"
                  placeholder="Select category"
                  data={categories}
                  value={formData.categoryId}
                  onChange={(value) =>
                    setFormData({ ...formData, categoryId: value })
                  }
                  searchable
                  clearable
                />
              </Grid.Col>
            </Grid>

            <Textarea
              label="Description"
              placeholder="Enter product description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              required
            />

            <Divider />

            <Text size="lg" fw={600}>Pricing & Stock</Text>
            
            <Grid>
              <Grid.Col span={{ base: 12, sm: 4 }}>
                <NumberInput
                  label="Price"
                  placeholder="0.00"
                  prefix="$"
                  value={formData.price}
                  onChange={(value) =>
                    setFormData({ ...formData, price: value })
                  }
                  min={0}
                  decimalScale={2}
                  required
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 4 }}>
                <NumberInput
                  label="Original Price (Optional)"
                  placeholder="0.00"
                  prefix="$"
                  value={formData.originalPrice}
                  onChange={(value) =>
                    setFormData({ ...formData, originalPrice: value })
                  }
                  min={0}
                  decimalScale={2}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 4 }}>
                <NumberInput
                  label="Stock Quantity"
                  placeholder="0"
                  value={formData.stock}
                  onChange={(value) =>
                    setFormData({ ...formData, stock: value })
                  }
                  min={0}
                  required
                />
              </Grid.Col>
            </Grid>

            <Divider />

            <Text size="lg" fw={600}>Product Variants</Text>
            
            <Grid>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TagsInput
                  label="Available Sizes"
                  placeholder="Enter sizes (press Enter to add)"
                  value={formData.sizes}
                  onChange={(value) =>
                    setFormData({ ...formData, sizes: value })
                  }
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TagsInput
                  label="Available Colors"
                  placeholder="Enter colors (press Enter to add)"
                  value={formData.colors}
                  onChange={(value) =>
                    setFormData({ ...formData, colors: value })
                  }
                />
              </Grid.Col>
            </Grid>

            <Divider />

            <Text size="lg" fw={600}>Product Images</Text>
            
            <div>
              <Text size="sm" fw={500} mb="xs">
                Upload Images (Up to 5 images)
              </Text>

              <FileInput
                placeholder="Upload product images"
                accept="image/*"
                multiple
                leftSection={<IconUpload size={16} />}
                onChange={handleImagesChange}
                disabled={images.length >= 5}
              />

              {imagePreviews.length > 0 && (
                <Stack gap="sm" mt="md">
                  <Text size="sm" c="dimmed">
                    Uploaded Images ({imagePreviews.length}/5)
                  </Text>
                  <Grid>
                    {imagePreviews.map((preview, index) => (
                      <Grid.Col key={index} span={{ base: 6, sm: 4, md: 3 }}>
                        <div style={{ position: 'relative' }}>
                          <Image
                            src={preview.url}
                            alt={`Preview ${index + 1}`}
                            height={120}
                            fit="cover"
                            radius="md"
                          />
                          <Button
                            size="xs"
                            variant="filled"
                            color="red"
                            style={{
                              position: 'absolute',
                              top: 5,
                              right: 5,
                            }}
                            onClick={() => removeImage(index)}
                          >
                            <IconX size={12} />
                          </Button>
                          <Text size="xs" c="dimmed" mt="xs" truncate>
                            {preview.name}
                          </Text>
                        </div>
                      </Grid.Col>
                    ))}
                  </Grid>
                </Stack>
              )}
            </div>

            <Divider />

            <Text size="lg" fw={600}>Product Settings</Text>
            
            <Grid>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Switch
                  label="Active Status"
                  description="Make product visible to customers"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isActive: e.currentTarget.checked,
                    })
                  }
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Switch
                  label="Featured Product"
                  description="Show product in featured section"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      featured: e.currentTarget.checked,
                    })
                  }
                />
              </Grid.Col>
            </Grid>

            <Group justify="flex-end" gap="sm" mt="xl">
              <Button variant="outline" color="gray" onClick={handleCancel}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                loading={isSubmitting}
                disabled={!formData.name.trim() || !formData.description.trim() || !formData.price || isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create Product'}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </>
  );
};

export default ProductAdd; 