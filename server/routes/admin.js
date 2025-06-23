const express = require('express');
const { db, auth } = require('../config/firebase');
const { verifyJWT, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Apply admin middleware to all routes
router.use(verifyJWT, requireAdmin);

// Get dashboard statistics
router.get('/dashboard', async (req, res) => {
  try {
    // Get total users
    const usersSnapshot = await db.collection('users').get();
    const totalUsers = usersSnapshot.size;

    // Get total products
    const productsSnapshot = await db.collection('products').get();
    const totalProducts = productsSnapshot.size;

    // Get total orders and revenue
    const ordersSnapshot = await db.collection('orders').get();
    let totalOrders = 0;
    let totalRevenue = 0;
    let pendingOrders = 0;
    let confirmedOrders = 0;

    ordersSnapshot.forEach((doc) => {
      const order = doc.data();
      totalOrders++;
      if (order.status === 'confirmed') {
        totalRevenue += order.totalAmount;
        confirmedOrders++;
      } else if (order.status === 'pending') {
        pendingOrders++;
      }
    });

    // Get recent orders
    const recentOrdersSnapshot = await db
      .collection('orders')
      .orderBy('createdAt', 'desc')
      .limit(5)
      .get();

    const recentOrders = [];
    recentOrdersSnapshot.forEach((doc) => {
      recentOrders.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    // Get low stock products
    const lowStockSnapshot = await db
      .collection('products')
      .where('stock', '<', 10)
      .where('isActive', '==', true)
      .get();

    const lowStockProducts = [];
    lowStockSnapshot.forEach((doc) => {
      lowStockProducts.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    res.json({
      statistics: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
        pendingOrders,
        confirmedOrders,
      },
      recentOrders,
      lowStockProducts,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all users (admin only)
router.get('/users', async (req, res) => {
  try {
    const { role, limit = 20, page = 1 } = req.query;

    let query = db.collection('users');

    if (role) {
      query = query.where('role', '==', role);
    }

    query = query.orderBy('createdAt', 'desc');

    const offset = (parseInt(page) - 1) * parseInt(limit);
    query = query.limit(parseInt(limit)).offset(offset);

    const snapshot = await query.get();
    const users = [];

    snapshot.forEach((doc) => {
      users.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: users.length,
      },
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Promote user to admin (admin only)
router.put('/users/:id/promote', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const userDoc = await db.collection('users').doc(id).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user role to admin
    await db.collection('users').doc(id).update({
      role: 'admin',
      updatedAt: new Date(),
      promotedBy: req.user.uid,
      promotedAt: new Date(),
    });

    res.json({
      message: 'User promoted to admin successfully',
      userId: id,
    });
  } catch (error) {
    console.error('Promote user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Demote admin to customer (admin only)
router.put('/users/:id/demote', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const userDoc = await db.collection('users').doc(id).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Prevent demoting yourself
    if (id === req.user.uid) {
      return res.status(400).json({ error: 'Cannot demote yourself' });
    }

    // Update user role to customer
    await db.collection('users').doc(id).update({
      role: 'customer',
      updatedAt: new Date(),
      demotedBy: req.user.uid,
      demotedAt: new Date(),
    });

    res.json({
      message: 'User demoted to customer successfully',
      userId: id,
    });
  } catch (error) {
    console.error('Demote user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user role
router.put('/users/:id/role', async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['customer', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    // Prevent changing your own role
    if (id === req.user.uid) {
      return res.status(400).json({ error: 'Cannot change your own role' });
    }

    await db.collection('users').doc(id).update({
      role,
      updatedAt: new Date(),
    });

    res.json({ message: 'User role updated successfully' });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent deleting yourself
    if (id === req.user.uid) {
      return res.status(400).json({ error: 'Cannot delete yourself' });
    }

    // Delete user from Firestore
    await db.collection('users').doc(id).delete();

    // Delete user from Firebase Auth
    await auth.deleteUser(id);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all orders (admin only)
router.get('/orders', async (req, res) => {
  try {
    const { status, limit = 20, page = 1 } = req.query;

    let query = db.collection('orders');

    if (status) {
      query = query.where('status', '==', status);
    }

    query = query.orderBy('createdAt', 'desc');

    const offset = (parseInt(page) - 1) * parseInt(limit);
    query = query.limit(parseInt(limit)).offset(offset);

    const snapshot = await query.get();
    const orders = [];

    snapshot.forEach((doc) => {
      orders.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    res.json({
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: orders.length,
      },
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update order status
router.put('/orders/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = [
      'pending',
      'confirmed',
      'shipped',
      'delivered',
      'cancelled',
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    await db.collection('orders').doc(id).update({
      status,
      updatedAt: new Date(),
    });

    res.json({ message: 'Order status updated successfully' });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get analytics data
router.get('/analytics', async (req, res) => {
  try {
    const { period = '30' } = req.query; // days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    // Get orders in the period
    const ordersSnapshot = await db
      .collection('orders')
      .where('createdAt', '>=', startDate)
      .get();

    const orders = [];
    ordersSnapshot.forEach((doc) => {
      orders.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    // Calculate analytics
    const totalRevenue = orders
      .filter((order) => order.status === 'confirmed')
      .reduce((sum, order) => sum + order.totalAmount, 0);

    const totalOrders = orders.length;
    const confirmedOrders = orders.filter(
      (order) => order.status === 'confirmed'
    ).length;

    // Group by date for chart data
    const revenueByDate = {};
    const ordersByDate = {};

    orders.forEach((order) => {
      const date = order.createdAt.toDate().toISOString().split('T')[0];

      if (!revenueByDate[date]) {
        revenueByDate[date] = 0;
        ordersByDate[date] = 0;
      }

      if (order.status === 'confirmed') {
        revenueByDate[date] += order.totalAmount;
      }
      ordersByDate[date]++;
    });

    // Get top selling products
    const productSales = {};
    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (!productSales[item.productId]) {
          productSales[item.productId] = {
            name: item.productName,
            quantity: 0,
            revenue: 0,
          };
        }
        productSales[item.productId].quantity += item.quantity;
        productSales[item.productId].revenue += item.total;
      });
    });

    const topProducts = Object.entries(productSales)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    res.json({
      period: parseInt(period),
      totalRevenue,
      totalOrders,
      confirmedOrders,
      revenueByDate,
      ordersByDate,
      topProducts,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get system settings
router.get('/settings', async (req, res) => {
  try {
    const settingsDoc = await db.collection('settings').doc('general').get();

    if (!settingsDoc.exists) {
      // Create default settings
      const defaultSettings = {
        siteName: 'RAclothier',
        siteDescription: 'Premium clothing store',
        contactEmail: 'admin@raclothier.com',
        contactPhone: '+1234567890',
        shippingCost: 10,
        freeShippingThreshold: 100,
        taxRate: 0.08,
        maintenanceMode: false,
        updatedAt: new Date(),
      };

      await db.collection('settings').doc('general').set(defaultSettings);
      return res.json(defaultSettings);
    }

    res.json(settingsDoc.data());
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update system settings
router.put('/settings', async (req, res) => {
  try {
    const {
      siteName,
      siteDescription,
      contactEmail,
      contactPhone,
      shippingCost,
      freeShippingThreshold,
      taxRate,
      maintenanceMode,
    } = req.body;

    const updateData = {
      siteName,
      siteDescription,
      contactEmail,
      contactPhone,
      shippingCost: parseFloat(shippingCost),
      freeShippingThreshold: parseFloat(freeShippingThreshold),
      taxRate: parseFloat(taxRate),
      maintenanceMode: maintenanceMode === 'true',
      updatedAt: new Date(),
    };

    await db.collection('settings').doc('general').update(updateData);

    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
