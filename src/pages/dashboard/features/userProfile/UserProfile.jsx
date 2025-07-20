import React, { useState } from 'react';
import {
  Title,
  Box,
  Group,
  Avatar,
  Text,
  Badge,
  Grid,
  Card,
  Button,
  TextInput,
  Stack,
  ActionIcon,
  Divider,
} from '@mantine/core';
import {
  IconMail,
  IconShield,
  IconCalendar,
  IconEdit,
  IconCheck,
  IconX,
  IconCamera,
  IconPhone,
} from '@tabler/icons-react';
import useStore from '../../../../store/useStore';
import { formatRelativeTime } from '../../../../utils/formatDate';

const UserProfile = () => {
  const { user, isAuthenticated } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    displayName: user?.displayName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
  });

  if (!isAuthenticated || !user) {
    return (
      <Card withBorder p="xl">
        <Text c="dimmed" ta="center">
          Please log in to view your profile.
        </Text>
      </Card>
    );
  }

  const handleEdit = () => {
    setEditForm({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      displayName: user?.displayName || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    // TODO: Implement API call to update user profile
    console.log('Saving profile:', editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleImageClick = () => {
    // TODO: Implement image edit modal
    console.log('Image edit clicked');
  };

  return (
    <div>
      <Group justify="space-between" mb="xl">
        <Title order={2}>User Profile</Title>
        {!isEditing && (
          <Button
            leftSection={<IconEdit size={16} />}
            onClick={handleEdit}
            variant="outline"
          >
            Edit Profile
          </Button>
        )}
      </Group>

      <Grid gutter="lg">
        {/* Profile Image Section */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card withBorder p="xl" ta="center">
            <Stack align="center" gap="md">
              <Box
                pos="relative"
                style={{ cursor: 'pointer' }}
                onClick={handleImageClick}
              >
                <Avatar
                  src={user.photoURL}
                  size={120}
                  radius="xl"
                  style={{ border: '3px solid var(--mantine-color-gray-2)' }}
                />
                <ActionIcon
                  size="sm"
                  variant="filled"
                  color="blue"
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                  }}
                >
                  <IconCamera size={14} />
                </ActionIcon>
              </Box>
              <Text size="sm" c="dimmed">
                Click to edit photo
              </Text>
            </Stack>
          </Card>
        </Grid.Col>

        {/* Profile Information Section */}
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Card withBorder p="xl">
            <Stack gap="lg">
              {/* Basic Information */}
              <div>
                <Text size="sm" fw={500} c="dimmed" mb="xs">
                  Basic Information
                </Text>
                <Grid gutter="md">
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <Text size="sm" fw={500} c="dimmed">
                      First Name
                    </Text>
                    {isEditing ? (
                      <TextInput
                        value={editForm.firstName}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            firstName: e.target.value,
                          })
                        }
                        placeholder="Enter first name"
                        size="sm"
                      />
                    ) : (
                      <Text>{user.firstName || '-'}</Text>
                    )}
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <Text size="sm" fw={500} c="dimmed">
                      Last Name
                    </Text>
                    {isEditing ? (
                      <TextInput
                        value={editForm.lastName}
                        onChange={(e) =>
                          setEditForm({ ...editForm, lastName: e.target.value })
                        }
                        placeholder="Enter last name"
                        size="sm"
                      />
                    ) : (
                      <Text>{user.lastName || '-'}</Text>
                    )}
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <Text size="sm" fw={500} c="dimmed">
                      Display Name
                    </Text>
                    {isEditing ? (
                      <TextInput
                        value={editForm.displayName}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            displayName: e.target.value,
                          })
                        }
                        placeholder="Enter display name"
                        size="sm"
                      />
                    ) : (
                      <Text>{user.displayName || '-'}</Text>
                    )}
                  </Grid.Col>
                </Grid>
              </div>

              <Divider />

              {/* Contact Information */}
              <div>
                <Text size="sm" fw={500} c="dimmed" mb="xs">
                  Contact Information
                </Text>
                <Grid gutter="md">
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <Text size="sm" fw={500} c="dimmed">
                      Email Address
                    </Text>

                    <Group gap="xs">
                      <IconMail size={16} />
                      <Text>{user.email}</Text>
                    </Group>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <Text size="sm" fw={500} c="dimmed">
                      Phone Number
                    </Text>
                    {isEditing ? (
                      <TextInput
                        value={editForm.phoneNumber}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            phoneNumber: e.target.value,
                          })
                        }
                        placeholder="Enter phone number"
                        size="sm"
                      />
                    ) : (
                      <Group gap="xs">
                        <IconPhone size={16} />
                        <Text>{user.phoneNumber || '-'}</Text>
                      </Group>
                    )}
                  </Grid.Col>
                </Grid>
              </div>

              <Divider />

              {/* Account Information */}
              <div>
                <Text size="sm" fw={500} c="dimmed" mb="xs">
                  Account Information
                </Text>
                <Grid gutter="md">
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <Text size="sm" fw={500} c="dimmed">
                      Role
                    </Text>
                    <Group gap="xs">
                      <IconShield size={16} />
                      <Badge
                        color={user.role === 'admin' ? 'red' : 'blue'}
                        variant="light"
                      >
                        {user.role || 'user'}
                      </Badge>
                    </Group>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <Text size="sm" fw={500} c="dimmed">
                      Account Created
                    </Text>
                    <Group gap="xs">
                      <IconCalendar size={16} />
                      <Text>{formatRelativeTime(user.createdAt)}</Text>
                    </Group>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <Text size="sm" fw={500} c="dimmed">
                      Last Updated
                    </Text>
                    <Group gap="xs">
                      <IconCalendar size={16} />
                      <Text>{formatRelativeTime(user.updatedAt)}</Text>
                    </Group>
                  </Grid.Col>
                </Grid>
              </div>

              {/* Edit Actions */}
              {isEditing && (
                <>
                  <Divider />
                  <Group justify="flex-end" gap="sm">
                    <Button
                      variant="outline"
                      color="gray"
                      leftSection={<IconX size={16} />}
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                    <Button
                      leftSection={<IconCheck size={16} />}
                      onClick={handleSave}
                    >
                      Save Changes
                    </Button>
                  </Group>
                </>
              )}
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
    </div>
  );
};

export default UserProfile;
