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
} from '@mantine/core';
import { IconPlus, IconUpload, IconX } from '@tabler/icons-react';
import { categoriesAPI } from '../../../../utils/api';
import toast from 'react-hot-toast';

const CategoryAdd = ({ 
  editMode = false, 
  categoryData = null, 
  onCategoryUpdated = null, 
  onCancel = null 
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true,
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Populate form data when in edit mode
  useEffect(() => {
    if (editMode && categoryData) {
      setFormData({
        name: categoryData.name || '',
        description: categoryData.description || '',
        isActive: categoryData.isActive !== undefined ? categoryData.isActive : true,
      });

      // Handle existing image for edit mode
      if (categoryData.image) {
        setImagePreview(categoryData.image);
      }
    }
  }, [editMode, categoryData]);

  const handleImageChange = (file) => {
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create FormData for multipart form
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('isActive', formData.isActive);

      if (image) {
        formDataToSend.append('image', image);
      }

      let result;
      if (editMode && categoryData?.id) {
        console.log('Updating category with data:', {
          id: categoryData.id,
          name: formData.name,
          description: formData.description,
          isActive: formData.isActive,
          hasNewImage: !!image,
        });

        result = await categoriesAPI.update(categoryData.id, formDataToSend);
        toast.success('Category updated successfully');
        
        if (onCategoryUpdated) {
          onCategoryUpdated();
        }
      } else {
        console.log('Creating category with data:', {
          name: formData.name,
          description: formData.description,
          isActive: formData.isActive,
          hasImage: !!image,
        });

        result = await categoriesAPI.create(formDataToSend);
        toast.success('Category created successfully');
        handleCancel();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      const action = editMode ? 'updating' : 'creating';
      toast.error(`Error ${action} category. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (editMode && onCancel) {
      onCancel();
    } else {
      setFormData({ name: '', description: '', isActive: true });
      setImage(null);
      setImagePreview(null);
      setModalOpen(false);
    }
  };

  // Form component
  const formContent = (
    <form onSubmit={handleSubmit}>
          <Stack gap="md">
            {/* Basic Information */}
            <Grid>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  label="Category Name"
                  placeholder="Enter category name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Switch
                  label="Active Status"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isActive: e.currentTarget.checked,
                    })
                  }
                />
              </Grid.Col>
            </Grid>

            <Textarea
              label="Description"
              placeholder="Enter category description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
            />

            {/* Image Upload */}
            <div>
              <Text size="sm" fw={500} mb="xs">
                Category Image (Optional)
              </Text>

              {!imagePreview ? (
                <FileInput
                  placeholder="Upload image"
                  accept="image/*"
                  leftSection={<IconUpload size={16} />}
                  onChange={handleImageChange}
                />
              ) : (
                <div>
                  <Group justify="space-between" mb="xs">
                    <Text size="sm" c="dimmed">
                      {image?.name ? `Image uploaded: ${image.name}` : 'Current category image'}
                    </Text>
                    <Button
                      size="xs"
                      variant="subtle"
                      color="red"
                      leftSection={<IconX size={14} />}
                      onClick={() => {
                        setImage(null);
                        setImagePreview(null);
                      }}
                    >
                      Remove
                    </Button>
                  </Group>
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={200}
                    height={150}
                    fit="cover"
                    radius="md"
                  />
                </div>
              )}
            </div>

            {/* Form Actions */}
            <Group justify="flex-end" gap="sm" mt="md">
              <Button variant="outline" color="gray" onClick={handleCancel}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                loading={isSubmitting}
                disabled={!formData.name.trim() || isSubmitting}
              >
                {isSubmitting ? (editMode ? 'Updating...' : 'Creating...') : (editMode ? 'Update Category' : 'Create Category')}
              </Button>
            </Group>
          </Stack>
    </form>
  );

  // Return different layouts based on mode
  if (editMode) {
    return formContent;
  }

  return (
    <>
      <Button
        leftSection={<IconPlus size={16} />}
        onClick={() => setModalOpen(true)}
      >
        Add Category
      </Button>

      <Modal
        opened={modalOpen}
        onClose={handleCancel}
        title="Add New Category"
        size="lg"
      >
        {formContent}
      </Modal>
    </>
  );
};

export default CategoryAdd;
