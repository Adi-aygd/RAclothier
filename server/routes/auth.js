const express = require('express');
const fetch = require('node-fetch');
const { auth, db } = require('../config/firebase');
const { verifyFirebaseToken } = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, secretKey } = req.body;

    let isAdmin = false;

    if (secretKey) {
      const ADMIN_SECRET = process.env.ADMIN_SECRET;
      if (secretKey === ADMIN_SECRET) {
        isAdmin = true;
      }
    }

    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: `${firstName} ${lastName}`,
    });

    // Store additional user data in Firestore
    const now = new Date().toISOString();
    const userData = {
      email,
      firstName,
      lastName,
      role: isAdmin ? 'admin' : 'customer',
      createdAt: now,
      updatedAt: now,
    };

    await db.collection('users').doc(userRecord.uid).set(userData);

    // Create JWT token
    const accessToken = jwt.sign(
      { uid: userRecord.uid, email: userRecord.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      type: 'success',
      status_code: 201,
      message: 'User created successfully',
      result: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
        tokens: {
          accessToken,
        },
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({
      type: 'error',
      status_code: 400,
      message: error.message,
      result: null,
    });
  }
});

// Login user with proper password verification
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const firebaseAuthUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_WEB_API_KEY}`;

    const authResponse = await fetch(firebaseAuthUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true,
      }),
    });

    const authData = await authResponse.json();

    if (!authResponse.ok) {
      console.error('Firebase Auth error:', authData);
      return res.status(400).json({
        type: 'error',
        status_code: 400,
        message: authData.error?.message || 'Invalid credentials',
        result: null,
      });
    }

    // Get user data from Firestore using the verified UID
    const userDoc = await db.collection('users').doc(authData.localId).get();

    if (!userDoc.exists) {
      return res.status(404).json({
        type: 'error',
        status_code: 404,
        message: 'User profile not found',
        result: null,
      });
    }

    const userData = userDoc.data();

    res.json({
      type: 'success',
      status_code: 200,
      message: 'Login successful',
      result: {
        uid: authData.localId,
        email: authData.email,
        displayName:
          userData.displayName ||
          authData.displayName ||
          `${userData.firstName} ${userData.lastName}`,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
        tokens: {
          accessToken: authData.idToken,
          refreshToken: authData.refreshToken,
        },
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      type: 'error',
      status_code: 500,
      message: 'Internal server error',
      result: null,
    });
  }
});

// Get user profile
router.get('/profile', verifyFirebaseToken, async (req, res) => {
  try {
    const userDoc = await db.collection('users').doc(req.user.uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({
        type: 'error',
        status_code: 404,
        message: 'User not found',
        result: null,
      });
    }

    const userData = userDoc.data();
    res.json({
      type: 'success',
      status_code: 200,
      message: 'Profile retrieved successfully',
      result: {
        uid: req.user.uid,
        email: req.user.email,
        displayName: req.user.displayName,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
      },
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      type: 'error',
      status_code: 500,
      message: 'Server error',
      result: null,
    });
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
      updatedAt: new Date().toISOString(),
    };

    await db.collection('users').doc(req.user.uid).update(updateData);

    res.json({
      type: 'success',
      status_code: 200,
      message: 'Profile updated successfully',
      result: null,
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      type: 'error',
      status_code: 500,
      message: 'Server error',
      result: null,
    });
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
