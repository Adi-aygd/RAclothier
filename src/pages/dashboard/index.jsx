import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import {
  IconBell,
  IconReceipt,
  IconDatabase,
  IconShield,
  IconSettings,
  IconShoppingCart,
  IconFileText,
  IconUsers,
  IconUser,
  IconPackage,
  IconPlus,
  IconEye,
  IconEdit,
  IconTrash,
  IconLogout,
  IconHeart,
  IconStar,
  IconMapPin,
} from '@tabler/icons-react';
import {
  SegmentedControl,
  Text,
  Button,
  Card,
  Group,
  Badge,
} from '@mantine/core';
import useStore from '../../store/useStore';
import classes from './dashboard.module.css';
import UserProfile from './components/userProfile/UserProfile';
import Category from './components/category/category';
const tabs = {
  user: [
    {
      link: '/dashboard/user-profile',
      label: 'Profile',
      icon: IconUser,
      description: 'View and edit your profile',
    },
    {
      link: '/dashboard/user-orders',
      label: 'Your Orders',
      icon: IconShoppingCart,
      description: 'Track your order history',
    },
    {
      link: '/dashboard/wishlist',
      label: 'Wishlist',
      icon: IconHeart,
      description: 'Your saved items',
    },
    {
      link: '/dashboard/reviews',
      label: 'Your Reviews',
      icon: IconStar,
      description: 'Products you reviewed',
    },
    {
      link: '/dashboard/addresses',
      label: 'Addresses',
      icon: IconMapPin,
      description: 'Manage shipping addresses',
    },
    {
      link: '/dashboard/notifications',
      label: 'Notifications',
      icon: IconBell,
      description: 'Email and push notifications',
    },
    {
      link: '/dashboard/security',
      label: 'Security',
      icon: IconShield,
      description: 'Password and account security',
    },
  ],
  admin: [
    {
      link: '/dashboard/admin/products',
      label: 'Products',
      icon: IconPackage,
      description: 'Manage product catalog',
    },
    {
      link: '/dashboard/admin/categories',
      label: 'Categories',
      icon: IconDatabase,
      description: 'Manage product categories',
    },
    {
      link: '/dashboard/admin/orders',
      label: 'Orders',
      icon: IconReceipt,
      description: 'View and manage orders',
    },
    {
      link: '/dashboard/admin/customers',
      label: 'Customers',
      icon: IconUsers,
      description: 'Customer management',
    },
    {
      link: '/dashboard/admin/analytics',
      label: 'Analytics',
      icon: IconFileText,
      description: 'Sales and performance data',
    },
    {
      link: '/dashboard/admin/settings',
      label: 'Settings',
      icon: IconSettings,
      description: 'Store configuration',
    },
  ],
};

// Protected Route Component for Dashboard
const DashboardProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user } = useStore();

  if (requireAdmin && user?.role !== 'admin') {
    return (
      <div className={classes.content}>
        <Text size="xl" fw={700} mb="md" c="red">
          Access Denied
        </Text>
        <Text c="dimmed">
          Admin privileges required to access this section.
        </Text>
      </div>
    );
  }

  return children;
};

export default function Dashboard() {
  const [section, setSection] = useState('user');
  const [active, setActive] = useState('Profile');
  const { user, isAuthenticated, logout } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if not authenticated
  if (!isAuthenticated || !user) {
    navigate('/login');
    return null;
  }

  // Update active tab based on current route
  useEffect(() => {
    const currentPath = location.pathname;
    const allTabs = [...tabs.user, ...tabs.admin];
    const currentTab = allTabs.find((tab) => tab.link === currentPath);

    if (currentTab) {
      setActive(currentTab.label);
      // Set section based on tab
      if (tabs.user.find((tab) => tab.link === currentPath)) {
        setSection('user');
      } else if (tabs.admin.find((tab) => tab.link === currentPath)) {
        setSection('admin');
      }
    }
  }, [location.pathname]);

  // Determine available sections based on user role
  const availableSections =
    user.role === 'admin'
      ? [
          { label: 'User', value: 'user' },
          { label: 'Admin', value: 'admin' },
        ]
      : [{ label: 'User', value: 'user' }];

  const links = tabs[section].map((item) => (
    <Card
      key={item.label}
      className={classes.link}
      data-active={item.label === active || undefined}
      onClick={() => {
        setActive(item.label);
        if (item.link) {
          navigate(item.link);
        }
      }}
      padding="md"
      radius="md"
      style={{ cursor: 'pointer' }}
    >
      <Group>
        <item.icon className={classes.linkIcon} stroke={1.5} />
        <div style={{ flex: 1 }}>
          <Text size="sm" fw={500}>
            {item.label}
          </Text>
          <Text size="xs" c="dimmed">
            {item.description}
          </Text>
        </div>
      </Group>
    </Card>
  ));

  return (
    <div className={classes.dashboard}>
      <div className={classes.leftSection}>
        <div>
          <Text fw={500} size="sm" className={classes.title} c="dimmed" mb="xs">
            {user.email}
          </Text>

          <SegmentedControl
            value={section}
            onChange={(value) => {
              setSection(value);
              setActive(tabs[value][0].label);
              navigate(tabs[value][0].link);
            }}
            transitionTimingFunction="ease"
            fullWidth
            data={availableSections}
            mb="md"
          />

          <div className={classes.navbarSection}>{links}</div>
        </div>

        <div className={classes.footer}>
          <Button
            variant="subtle"
            leftSection={<IconLogout size={16} />}
            onClick={logout}
            color="red"
            fullWidth
          >
            Logout
          </Button>
        </div>
      </div>

      <div className={classes.rightSection}>
        <Routes>
          {/* Default dashboard view */}
          <Route
            path="/"
            element={
              <div className={classes.content}>
                <Text size="xl" fw={700} mb="md">
                  Welcome to your Dashboard
                </Text>
                <Text c="dimmed" mb="lg">
                  Select an option from the sidebar to get started.
                </Text>
              </div>
            }
          />

          {/* User Routes */}
          <Route
            path="/user-profile"
            element={
              <div className={classes.content}>
                <UserProfile />
              </div>
            }
          />
          <Route
            path="/user-orders"
            element={
              <div className={classes.content}>
                <Text size="xl" fw={700} mb="md">
                  Your Orders
                </Text>
                <Card withBorder padding="lg">
                  <Text c="dimmed" ta="center" py="xl">
                    No orders found. Start shopping to see your order history.
                  </Text>
                  <Button onClick={() => navigate('/shop')}>
                    Browse Products
                  </Button>
                </Card>
              </div>
            }
          />
          <Route
            path="/wishlist"
            element={
              <div className={classes.content}>
                <Text size="xl" fw={700} mb="md">
                  Wishlist
                </Text>
                <Card withBorder padding="lg">
                  <Text c="dimmed" ta="center" py="xl">
                    Your wishlist is empty. Start adding items you love!
                  </Text>
                </Card>
              </div>
            }
          />
          <Route
            path="/reviews"
            element={
              <div className={classes.content}>
                <Text size="xl" fw={700} mb="md">
                  Your Reviews
                </Text>
                <Card withBorder padding="lg">
                  <Text c="dimmed" ta="center" py="xl">
                    You haven't written any reviews yet.
                  </Text>
                </Card>
              </div>
            }
          />
          <Route
            path="/addresses"
            element={
              <div className={classes.content}>
                <Text size="xl" fw={700} mb="md">
                  Addresses
                </Text>
                <Card withBorder padding="lg">
                  <Text c="dimmed" ta="center" py="xl">
                    Manage your shipping addresses here.
                  </Text>
                </Card>
              </div>
            }
          />
          <Route
            path="/notifications"
            element={
              <div className={classes.content}>
                <Text size="xl" fw={700} mb="md">
                  Notifications
                </Text>
                <Card withBorder padding="lg">
                  <Text c="dimmed" ta="center" py="xl">
                    Configure your notification preferences.
                  </Text>
                </Card>
              </div>
            }
          />
          <Route
            path="/security"
            element={
              <div className={classes.content}>
                <Text size="xl" fw={700} mb="md">
                  Security
                </Text>
                <Card withBorder padding="lg">
                  <Text c="dimmed" ta="center" py="xl">
                    Manage your account security settings.
                  </Text>
                </Card>
              </div>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/products"
            element={
              <DashboardProtectedRoute requireAdmin={true}>
                <div className={classes.content}>
                  <Group justify="space-between" mb="md">
                    <Text size="xl" fw={700}>
                      Product Management
                    </Text>
                    <Button leftSection={<IconPlus size={16} />}>
                      Add Product
                    </Button>
                  </Group>
                  <Card withBorder padding="lg">
                    <Text c="dimmed" ta="center" py="xl">
                      Product management interface will be implemented here.
                    </Text>
                  </Card>
                </div>
              </DashboardProtectedRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <DashboardProtectedRoute requireAdmin={true}>
                <Category />
              </DashboardProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <DashboardProtectedRoute requireAdmin={true}>
                <div className={classes.content}>
                  <Text size="xl" fw={700} mb="md">
                    Order Management
                  </Text>
                  <Card withBorder padding="lg">
                    <Text c="dimmed" ta="center" py="xl">
                      Order management interface will be implemented here.
                    </Text>
                  </Card>
                </div>
              </DashboardProtectedRoute>
            }
          />
          <Route
            path="/admin/customers"
            element={
              <DashboardProtectedRoute requireAdmin={true}>
                <div className={classes.content}>
                  <Text size="xl" fw={700} mb="md">
                    Customer Management
                  </Text>
                  <Card withBorder padding="lg">
                    <Text c="dimmed" ta="center" py="xl">
                      Customer management interface will be implemented here.
                    </Text>
                  </Card>
                </div>
              </DashboardProtectedRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <DashboardProtectedRoute requireAdmin={true}>
                <div className={classes.content}>
                  <Text size="xl" fw={700} mb="md">
                    Analytics
                  </Text>
                  <Card withBorder padding="lg">
                    <Text c="dimmed" ta="center" py="xl">
                      Analytics dashboard will be implemented here.
                    </Text>
                  </Card>
                </div>
              </DashboardProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <DashboardProtectedRoute requireAdmin={true}>
                <div className={classes.content}>
                  <Text size="xl" fw={700} mb="md">
                    Settings
                  </Text>
                  <Card withBorder padding="lg">
                    <Text c="dimmed" ta="center" py="xl">
                      Store settings will be implemented here.
                    </Text>
                  </Card>
                </div>
              </DashboardProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}
