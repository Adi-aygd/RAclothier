const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');
const { body, validationResult, query } = require('express-validator');

// Order status constants
const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded'
};

const PAYMENT_METHODS = {
  ESEWA: 'esewa',
  COD: 'cod',
  CARD: 'card'
};

// Validation middleware for creating orders
const validateCreateOrder = [
  body('userId').notEmpty().withMessage('User ID is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('address').notEmpty().withMessage('Address is required'),
  body('city').notEmpty().withMessage('City is required'),
  body('state').notEmpty().withMessage('State is required'),
  body('zipCode').notEmpty().withMessage('ZIP code is required'),
  body('country').notEmpty().withMessage('Country is required'),
  body('paymentMethod').isIn(Object.values(PAYMENT_METHODS)).withMessage('Invalid payment method'),
  body('total_amount').isNumeric().withMessage('Total amount must be a number'),
  body('cart').isArray({ min: 1 }).withMessage('Cart must contain at least one item'),
  body('cart.*.id').notEmpty().withMessage('Product ID is required for each cart item'),
  body('cart.*.name').notEmpty().withMessage('Product name is required for each cart item'),
  body('cart.*.price').isNumeric().withMessage('Product price must be a number'),
  body('cart.*.quantity').isInt({ min: 1 }).withMessage('Product quantity must be at least 1'),
];

// Validation middleware for updating order status
const validateUpdateStatus = [
  body('status').isIn(Object.values(ORDER_STATUS)).withMessage('Invalid order status'),
];

// Validation middleware for query parameters
const validateQuery = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('sortBy').optional().isIn(['createdAt', 'updatedAt', 'total_amount', 'status']).withMessage('Invalid sort field'),
  query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc'),
  query('status').optional().isIn(Object.values(ORDER_STATUS)).withMessage('Invalid status filter'),
];

// Helper function to generate order ID
const generateOrderId = () => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substr(2, 5).toUpperCase();
  return `RNA${timestamp.slice(-6)}${random}`;
};

// CREATE - Create a new order
router.post('/', validateCreateOrder, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      userId,
      email,
      firstName,
      lastName,
      phone,
      address,
      city,
      state,
      zipCode,
      country,
      paymentMethod,
      total_amount,
      cart,
      orderNotes,
      // Payment specific fields
      transaction_uuid,
      transaction_code,
      ref_id
    } = req.body;

    const orderId = generateOrderId();
    const now = new Date();

    // Calculate order totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = Math.round(subtotal * 0.1); // 10% tax
    const shipping = subtotal > 500 ? 0 : 100; // Free shipping over 500
    const calculatedTotal = subtotal + tax + shipping;

    // Verify total amount matches calculation (with small tolerance for rounding)
    if (Math.abs(calculatedTotal - total_amount) > 1) {
      return res.status(400).json({
        success: false,
        message: 'Total amount mismatch',
        calculated: calculatedTotal,
        provided: total_amount
      });
    }

    const orderData = {
      orderId,
      userId,
      email,
      
      // Shipping Information
      shippingInfo: {
        firstName,
        lastName,
        phone,
        address,
        city,
        state,
        zipCode,
        country
      },
      
      // Order Items
      items: cart.map(item => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size || null,
        color: item.color || null,
        image: item.images?.[0] || null,
        subtotal: item.price * item.quantity
      })),
      
      // Order Totals
      pricing: {
        subtotal,
        tax,
        shipping,
        total: total_amount
      },
      
      // Payment Information
      payment: {
        method: paymentMethod,
        status: paymentMethod === 'esewa' ? 'paid' : 'pending',
        transaction_uuid: transaction_uuid || null,
        transaction_code: transaction_code || null,
        ref_id: ref_id || null
      },
      
      // Order Status and Metadata
      status: paymentMethod === 'esewa' ? ORDER_STATUS.CONFIRMED : ORDER_STATUS.PENDING,
      orderNotes: orderNotes || '',
      
      // Timestamps
      createdAt: now,
      updatedAt: now,
      
      // Tracking
      trackingNumber: null,
      estimatedDelivery: null
    };

    // Save to Firestore
    const orderRef = db.collection('orders').doc(orderId);
    await orderRef.set(orderData);

    console.log(`✅ Order created: ${orderId} for user: ${userId}`);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: {
        orderId,
        status: orderData.status,
        total: total_amount,
        createdAt: now
      }
    });

  } catch (error) {
    console.error('❌ Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
});

// READ - Get orders with pagination, sorting, and filtering
router.get('/', validateQuery, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid query parameters',
        errors: errors.array()
      });
    }

    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      userId,
      status,
      paymentMethod
    } = req.query;

    let query = db.collection('orders');

    // Apply filters
    if (userId) {
      query = query.where('userId', '==', userId);
    }
    if (status) {
      query = query.where('status', '==', status);
    }
    if (paymentMethod) {
      query = query.where('payment.method', '==', paymentMethod);
    }

    // Apply sorting
    query = query.orderBy(sortBy, sortOrder);

    // Apply pagination
    const offset = (page - 1) * limit;
    query = query.offset(offset).limit(parseInt(limit));

    const snapshot = await query.get();
    const orders = [];

    snapshot.forEach(doc => {
      const orderData = doc.data();
      orders.push({
        id: doc.id,
        orderId: orderData.orderId,
        userId: orderData.userId,
        email: orderData.email,
        status: orderData.status,
        paymentMethod: orderData.payment?.method,
        paymentStatus: orderData.payment?.status,
        total: orderData.pricing?.total,
        itemCount: orderData.items?.length || 0,
        createdAt: orderData.createdAt?.toDate?.() || orderData.createdAt,
        updatedAt: orderData.updatedAt?.toDate?.() || orderData.updatedAt,
        shippingInfo: {
          name: `${orderData.shippingInfo?.firstName} ${orderData.shippingInfo?.lastName}`,
          city: orderData.shippingInfo?.city,
          country: orderData.shippingInfo?.country
        }
      });
    });

    // Get total count for pagination (this is expensive, consider caching)
    let totalQuery = db.collection('orders');
    if (userId) totalQuery = totalQuery.where('userId', '==', userId);
    if (status) totalQuery = totalQuery.where('status', '==', status);
    if (paymentMethod) totalQuery = totalQuery.where('payment.method', '==', paymentMethod);
    
    const totalSnapshot = await totalQuery.get();
    const totalOrders = totalSnapshot.size;
    const totalPages = Math.ceil(totalOrders / limit);

    res.json({
      success: true,
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalOrders,
        hasNext: page < totalPages,
        hasPrev: page > 1,
        limit: parseInt(limit)
      },
      filters: {
        userId,
        status,
        paymentMethod,
        sortBy,
        sortOrder
      }
    });

  } catch (error) {
    console.error('❌ Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
});

// READ - Get single order by ID
router.get('/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    const orderRef = db.collection('orders').doc(orderId);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const orderData = orderDoc.data();
    
    // Convert Firestore timestamps to JavaScript dates
    const order = {
      ...orderData,
      createdAt: orderData.createdAt?.toDate?.() || orderData.createdAt,
      updatedAt: orderData.updatedAt?.toDate?.() || orderData.updatedAt
    };

    res.json({
      success: true,
      order
    });

  } catch (error) {
    console.error('❌ Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message
    });
  }
});

// UPDATE - Update order status
router.patch('/:orderId/status', validateUpdateStatus, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { orderId } = req.params;
    const { status, trackingNumber, estimatedDelivery } = req.body;

    const orderRef = db.collection('orders').doc(orderId);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const updateData = {
      status,
      updatedAt: new Date()
    };

    // Add optional fields if provided
    if (trackingNumber) updateData.trackingNumber = trackingNumber;
    if (estimatedDelivery) updateData.estimatedDelivery = new Date(estimatedDelivery);

    await orderRef.update(updateData);

    console.log(`✅ Order ${orderId} status updated to: ${status}`);

    res.json({
      success: true,
      message: 'Order status updated successfully',
      orderId,
      status,
      updatedAt: updateData.updatedAt
    });

  } catch (error) {
    console.error('❌ Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message
    });
  }
});

// UPDATE - Update payment information (for eSewa confirmation)
router.patch('/:orderId/payment', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { transaction_code, ref_id, status } = req.body;

    const orderRef = db.collection('orders').doc(orderId);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const updateData = {
      'payment.transaction_code': transaction_code,
      'payment.ref_id': ref_id,
      'payment.status': status || 'paid',
      status: ORDER_STATUS.CONFIRMED,
      updatedAt: new Date()
    };

    await orderRef.update(updateData);

    console.log(`✅ Order ${orderId} payment updated`);

    res.json({
      success: true,
      message: 'Payment information updated successfully',
      orderId
    });

  } catch (error) {
    console.error('❌ Error updating payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update payment information',
      error: error.message
    });
  }
});

// DELETE - Cancel order (soft delete by changing status)
router.delete('/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;

    const orderRef = db.collection('orders').doc(orderId);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const orderData = orderDoc.data();

    // Check if order can be cancelled
    if ([ORDER_STATUS.SHIPPED, ORDER_STATUS.DELIVERED].includes(orderData.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel shipped or delivered orders'
      });
    }

    await orderRef.update({
      status: ORDER_STATUS.CANCELLED,
      cancelReason: reason || 'Cancelled by user',
      cancelledAt: new Date(),
      updatedAt: new Date()
    });

    console.log(`✅ Order ${orderId} cancelled`);

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      orderId
    });

  } catch (error) {
    console.error('❌ Error cancelling order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order',
      error: error.message
    });
  }
});

// GET - Order statistics (for admin dashboard)
router.get('/stats/summary', async (req, res) => {
  try {
    const ordersRef = db.collection('orders');
    
    // Get all orders
    const allOrdersSnapshot = await ordersRef.get();
    const totalOrders = allOrdersSnapshot.size;
    
    let totalRevenue = 0;
    const statusCounts = {};
    const paymentMethodCounts = {};
    
    allOrdersSnapshot.forEach(doc => {
      const order = doc.data();
      
      // Calculate revenue
      if (order.payment?.status === 'paid') {
        totalRevenue += order.pricing?.total || 0;
      }
      
      // Count statuses
      const status = order.status || 'unknown';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
      
      // Count payment methods
      const paymentMethod = order.payment?.method || 'unknown';
      paymentMethodCounts[paymentMethod] = (paymentMethodCounts[paymentMethod] || 0) + 1;
    });

    res.json({
      success: true,
      stats: {
        totalOrders,
        totalRevenue,
        statusCounts,
        paymentMethodCounts
      }
    });

  } catch (error) {
    console.error('❌ Error fetching order stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order statistics',
      error: error.message
    });
  }
});

module.exports = router;
