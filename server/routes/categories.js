const express = require('express');
const { db } = require('../config/firebase');
const { verifyFirebaseToken, requireAdmin } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Configure multer for image uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  },
});

// Get all categories (public)
router.get('/', async (req, res) => {
  try {
    const { isActive } = req.query;

    let query = db.collection('categories');
    if (isActive !== undefined) {
      query = query.where('isActive', '==', isActive === 'true');
    }

    query = query.orderBy('name', 'asc');

    const snapshot = await query.get();
    const categories = [];

    snapshot.forEach((doc) => {
      categories.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    res.status(200).json({
      type: 'success',
      status_code: 200,
      message: 'Categories fetched successfully',
      result: categories,
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      type: 'error',
      status_code: 500,
      message: 'Server error',
      result: null,
    });
  }
});

// Get single category (public)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await db.collection('categories').doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({
        type: 'error',
        status_code: 404,
        message: 'Category not found',
        result: null,
      });
    }

    const category = {
      id: doc.id,
      ...doc.data(),
    };

    res.status(200).json({
      type: 'success',
      status_code: 200,
      message: 'Category fetched successfully',
      result: category,
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({
      type: 'error',
      status_code: 500,
      message: 'Server error',
      result: null,
    });
  }
});

// Create category (admin only)
router.post(
  '/',
  verifyFirebaseToken,
  requireAdmin,
  upload.single('image'),
  async (req, res) => {
    try {
      const { name, description, isActive = true } = req.body;

      if (!name) {
        return res.status(400).json({
          type: 'error',
          status_code: 400,
          message: 'Category name is required',
          result: null,
        });
      }

      const categoryData = {
        name,
        description: description || '',
        isActive: isActive === 'true',
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: req.user.uid,
      };

      // Handle image upload
      if (req.file) {
        try {
          const { bucket } = require('../config/firebase');

          if (!bucket) {
            console.warn(
              '⚠️  Firebase Storage bucket not available, skipping image upload'
            );
          } else {
            const fileName = `categories/${Date.now()}-${
              req.file.originalname
            }`;
            const fileUpload = bucket.file(fileName);

            await fileUpload.save(req.file.buffer, {
              metadata: {
                contentType: req.file.mimetype,
              },
            });

            await fileUpload.makePublic();

            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
            categoryData.image = publicUrl;
            console.log('✅ Category image uploaded successfully');
          }
        } catch (uploadError) {
          console.error('❌ Image upload error:', uploadError.message);
          console.log(
            '💡 Category created without image. Enable Firebase Storage for image uploads.'
          );
        }
      }

      const docRef = await db.collection('categories').add(categoryData);

      res.status(201).json({
        type: 'success',
        status_code: 201,
        message: 'Category created successfully',
        result: {
          id: docRef.id,
          ...categoryData,
        },
      });
    } catch (error) {
      console.error('Create category error:', error);
      res.status(500).json({
        type: 'error',
        status_code: 500,
        message: 'Server error',
        result: null,
      });
    }
  }
);

// Update category (admin only)
router.put(
  '/:id',
  verifyFirebaseToken,
  requireAdmin,
  upload.single('image'),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, isActive } = req.body;

      // Check if category exists
      const categoryDoc = await db.collection('categories').doc(id).get();
      if (!categoryDoc.exists) {
        return res.status(404).json({
          type: 'error',
          status_code: 404,
          message: 'Category not found',
          result: null,
        });
      }

      const updateData = {
        updatedAt: new Date(),
        updatedBy: req.user.uid,
      };

      if (name !== undefined) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (isActive !== undefined) updateData.isActive = isActive === 'true';

      // Handle image upload
      if (req.file) {
        try {
          const { bucket } = require('../config/firebase');

          if (!bucket) {
            console.warn(
              '⚠️  Firebase Storage bucket not available, skipping image upload'
            );
          } else {
            const fileName = `categories/${Date.now()}-${
              req.file.originalname
            }`;
            const fileUpload = bucket.file(fileName);

            await fileUpload.save(req.file.buffer, {
              metadata: {
                contentType: req.file.mimetype,
              },
            });

            await fileUpload.makePublic();

            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
            updateData.image = publicUrl;
            console.log('✅ Category image updated successfully');
          }
        } catch (uploadError) {
          console.error('❌ Image upload error:', uploadError.message);
          console.log(
            '💡 Category updated without image. Enable Firebase Storage for image uploads.'
          );
        }
      }

      await db.collection('categories').doc(id).update(updateData);

      res.status(200).json({
        type: 'success',
        status_code: 200,
        message: 'Category updated successfully',
        result: null,
      });
    } catch (error) {
      console.error('Update category error:', error);
      res.status(500).json({
        type: 'error',
        status_code: 500,
        message: 'Server error',
        result: null,
      });
    }
  }
);

// Delete category (admin only)
router.delete('/:id', verifyFirebaseToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if category exists
    const categoryDoc = await db.collection('categories').doc(id).get();
    if (!categoryDoc.exists) {
      return res.status(404).json({
        type: 'error',
        status_code: 404,
        message: 'Category not found',
        result: null,
      });
    }

    // Check if category has products
    const productsSnapshot = await db
      .collection('products')
      .where('categoryId', '==', id)
      .limit(1)
      .get();
    if (!productsSnapshot.empty) {
      return res.status(400).json({
        type: 'error',
        status_code: 400,
        message: 'Cannot delete category with existing products',
        result: null,
      });
    }

    await db.collection('categories').doc(id).delete();

    res.status(200).json({
      type: 'success',
      status_code: 200,
      message: 'Category deleted successfully',
      result: null,
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      type: 'error',
      status_code: 500,
      message: 'Server error',
      result: null,
    });
  }
});

module.exports = router;
