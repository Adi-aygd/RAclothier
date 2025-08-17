import React, { useState } from 'react';
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

const CategoryAdd = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true,
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create FormData for multipart form
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('isActive', formData.isActive);

    if (image) {
      formDataToSend.append('image', image);
    }

    console.log('Form data to send:', {
      name: formData.name,
      description: formData.description,
      isActive: formData.isActive,
      image: image ? image.name : 'No image',
    });

    // TODO: Implement API call
    // const response = await fetch('/api/categories', {
    //   method: 'POST',
    //   body: formDataToSend,
    // });

    // Reset form and close modal
    setFormData({ name: '', description: '', isActive: true });
    setImage(null);
    setImagePreview(null);
    setModalOpen(false);
  };

  const handleCancel = () => {
    setFormData({ name: '', description: '', isActive: true });
    setImage(null);
    setImagePreview(null);
    setModalOpen(false);
  };

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
                      Image uploaded: {image?.name}
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
              <Button type="submit" disabled={!formData.name.trim()}>
                Create Category
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </>
  );
};

export default CategoryAdd;
