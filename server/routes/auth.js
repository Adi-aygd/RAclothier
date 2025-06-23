const express = require('express');
const { auth, db } = require('../config/firebase');
const { verifyFirebaseToken } = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: `${firstName} ${lastName}`,
    });

    // Store additional user data in Firestore
    await db.collection('users').doc(userRecord.uid).set({
      email,
      firstName,
      lastName,
      role: 'customer',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.status(201).json({
      message: 'User created successfully',
      uid: userRecord.uid,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Create first admin (no auth required)
router.post('/create-first-admin', async (req, res) => {
  try {
    const { email, password, firstName, lastName, secretKey } = req.body;

    // Check if secret key matches (you can set this in environment variables)
    const ADMIN_SECRET = process.env.ADMIN_SECRET;
    if (secretKey !== ADMIN_SECRET) {
      return res.status(403).json({ error: 'Invalid secret key' });
    }

    // Check if any admin already exists
    const adminSnapshot = await db
      .collection('users')
      .where('role', '==', 'admin')
      .limit(1)
      .get();
    if (!adminSnapshot.empty) {
      return res
        .status(400)
        .json({ error: 'Admin already exists. Use regular admin routes.' });
    }

    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: `${firstName} ${lastName}`,
    });

    // Store admin data in Firestore
    await db.collection('users').doc(userRecord.uid).set({
      email,
      firstName,
      lastName,
      role: 'admin',
      isFirstAdmin: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.status(201).json({
      message: 'First admin created successfully',
      uid: userRecord.uid,
      role: 'admin',
    });
  } catch (error) {
    console.error('Create first admin error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Get user by email
    const userRecord = await auth.getUserByEmail(email);

    // In a real app, you'd verify the password here
    // For now, we'll just return the user info
    // You might want to implement password verification with bcrypt

    // Create a custom JWT token for server-side sessions
    const token = jwt.sign(
      { uid: userRecord.uid, email: userRecord.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Get user data from Firestore
    const userDoc = await db.collection('users').doc(userRecord.uid).get();
    const userData = userDoc.data();

    res.json({
      message: 'Login successful',
      token,
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        ...userData,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({ error: 'Invalid credentials' });
  }
});

// Get user profile
router.get('/profile', verifyFirebaseToken, async (req, res) => {
  try {
    const userDoc = await db.collection('users').doc(req.user.uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = userDoc.data();
    res.json({
      uid: req.user.uid,
      email: req.user.email,
      ...userData,
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user profile
router.put('/profile', verifyFirebaseToken, async (req, res) => {
  try {
    const { firstName, lastName, address } = req.body;

    const updateData = {
      firstName,
      lastName,
      address,
      updatedAt: new Date(),
    };

    await db.collection('users').doc(req.user.uid).update(updateData);

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Change password
router.put('/change-password', verifyFirebaseToken, async (req, res) => {
  try {
    const { newPassword } = req.body;

    await auth.updateUser(req.user.uid, {
      password: newPassword,
    });

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete user account
router.delete('/account', verifyFirebaseToken, async (req, res) => {
  try {
    // Delete user from Firestore
    await db.collection('users').doc(req.user.uid).delete();

    // Delete user from Firebase Auth
    await auth.deleteUser(req.user.uid);

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Account deletion error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
