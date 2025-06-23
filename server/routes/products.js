const express = require('express');
const { db, bucket } = require('../config/firebase');
const { verifyJWT, requireAdmin } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Configure multer for file uploads
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

// Get all products (public)
router.get('/', async (req, res) => {
  try {
    const {
      categoryId,
      search,
      sort = 'name',
      order = 'asc',
      limit = 20,
      page = 1,
      featured,
      isActive = true,
    } = req.query;

    let query = db
      .collection('products')
      .where('isActive', '==', isActive === 'true');

    // Apply category filter
    if (categoryId) {
      query = query.where('categoryId', '==', categoryId);
    }

    // Apply featured filter
    if (featured !== undefined) {
      query = query.where('featured', '==', featured === 'true');
    }

    // Apply search filter
    if (search) {
      query = query.where(
        'searchKeywords',
        'array-contains',
        search.toLowerCase()
      );
    }

    // Apply sorting
    query = query.orderBy(sort, order);

    // Apply pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    query = query.limit(parseInt(limit)).offset(offset);

    const snapshot = await query.get();
    const products = [];

    snapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    res.json({
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: products.length,
      },
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single product (public)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await db.collection('products').doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = {
      id: doc.id,
      ...doc.data(),
    };

    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create product (admin only)
router.post(
  '/',
  verifyJWT,
  requireAdmin,
  upload.array('images', 5),
  async (req, res) => {
    try {
      const {
        name,
        description,
        price,
        categoryId,
        stock = 0,
        isActive = true,
        featured = false,
        sizes,
        colors,
        originalPrice,
        rating = 0,
        reviews = 0,
      } = req.body;

      // Validate required fields
      if (!name || !description || !price || !categoryId) {
        return res.status(400).json({
          error: 'Name, description, price, and categoryId are required',
        });
      }

      // Validate category exists
      const categoryDoc = await db
        .collection('categories')
        .doc(categoryId)
        .get();
      if (!categoryDoc.exists) {
        return res.status(400).json({ error: 'Category not found' });
      }

      const categoryData = categoryDoc.data();

      const productData = {
        name,
        description,
        price: parseFloat(price),
        categoryId,
        categoryName: categoryData.name, // Store category name for easy access
        stock: parseInt(stock) || 0,
        isActive: isActive === 'true',
        featured: featured === 'true',
        searchKeywords: [name.toLowerCase(), description.toLowerCase()],
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: req.user.uid,
      };

      // Optional fields
      if (originalPrice) productData.originalPrice = parseFloat(originalPrice);
      if (sizes) productData.sizes = JSON.parse(sizes);
      if (colors) productData.colors = JSON.parse(colors);
      if (rating) productData.rating = parseFloat(rating);
      if (reviews) productData.reviews = parseInt(reviews);

      // Handle image uploads
      if (req.files && req.files.length > 0) {
        try {
          if (!bucket) {
            console.warn(
              '⚠️  Firebase Storage bucket not available, skipping image uploads'
            );
          } else {
            const imageUrls = [];

            for (const file of req.files) {
              const fileName = `products/${Date.now()}-${file.originalname}`;
              const fileUpload = bucket.file(fileName);

              await fileUpload.save(file.buffer, {
                metadata: {
                  contentType: file.mimetype,
                },
              });

              await fileUpload.makePublic();

              const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
              imageUrls.push(publicUrl);
            }

            productData.images = imageUrls;
            console.log(
              `✅ ${imageUrls.length} product images uploaded successfully`
            );
          }
        } catch (uploadError) {
          console.error('❌ Image upload error:', uploadError.message);
          console.log(
            '💡 Product created without images. Enable Firebase Storage for image uploads.'
          );
        }
      }

      const docRef = await db.collection('products').add(productData);

      res.status(201).json({
        message: 'Product created successfully',
        productId: docRef.id,
      });
    } catch (error) {
      console.error('Create product error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Update product (admin only)
router.put(
  '/:id',
  verifyJWT,
  requireAdmin,
  upload.array('images', 5),
  async (req, res) => {
    try {
      const { id } = req.params;
      const {
        name,
        description,
        price,
        categoryId,
        stock,
        isActive,
        featured,
        sizes,
        colors,
        originalPrice,
        rating,
        reviews,
      } = req.body;

      // Check if product exists
      const productDoc = await db.collection('products').doc(id).get();
      if (!productDoc.exists) {
        return res.status(404).json({ error: 'Product not found' });
      }

      const updateData = {
        updatedAt: new Date(),
        updatedBy: req.user.uid,
      };

      // Update fields if provided
      if (name !== undefined) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (price !== undefined) updateData.price = parseFloat(price);
      if (stock !== undefined) updateData.stock = parseInt(stock);
      if (isActive !== undefined) updateData.isActive = isActive === 'true';
      if (featured !== undefined) updateData.featured = featured === 'true';
      if (originalPrice !== undefined)
        updateData.originalPrice = parseFloat(originalPrice);
      if (rating !== undefined) updateData.rating = parseFloat(rating);
      if (reviews !== undefined) updateData.reviews = parseInt(reviews);
      if (sizes !== undefined) updateData.sizes = JSON.parse(sizes);
      if (colors !== undefined) updateData.colors = JSON.parse(colors);

      // Update category if provided
      if (categoryId !== undefined) {
        const categoryDoc = await db
          .collection('categories')
          .doc(categoryId)
          .get();
        if (!categoryDoc.exists) {
          return res.status(400).json({ error: 'Category not found' });
        }
        updateData.categoryId = categoryId;
        updateData.categoryName = categoryDoc.data().name;
      }

      // Update search keywords if name or description changed
      if (name !== undefined || description !== undefined) {
        const newName = name || productDoc.data().name;
        const newDescription = description || productDoc.data().description;
        updateData.searchKeywords = [
          newName.toLowerCase(),
          newDescription.toLowerCase(),
        ];
      }

      // Handle image uploads
      if (req.files && req.files.length > 0) {
        try {
          if (!bucket) {
            console.warn(
              '⚠️  Firebase Storage bucket not available, skipping image uploads'
            );
          } else {
            const imageUrls = [];

            for (const file of req.files) {
              const fileName = `products/${Date.now()}-${file.originalname}`;
              const fileUpload = bucket.file(fileName);

              await fileUpload.save(file.buffer, {
                metadata: {
                  contentType: file.mimetype,
                },
              });

              await fileUpload.makePublic();

              const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
              imageUrls.push(publicUrl);
            }

            updateData.images = imageUrls;
            console.log(
              `✅ ${imageUrls.length} product images updated successfully`
            );
          }
        } catch (uploadError) {
          console.error('❌ Image upload error:', uploadError.message);
          console.log(
            '💡 Product updated without images. Enable Firebase Storage for image uploads.'
          );
        }
      }

      await db.collection('products').doc(id).update(updateData);

      res.json({ message: 'Product updated successfully' });
    } catch (error) {
      console.error('Update product error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Delete product (admin only)
router.delete('/:id', verifyJWT, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Get product to delete associated images
    const doc = await db.collection('products').doc(id).get();
    if (doc.exists) {
      const product = doc.data();

      // Delete images from Firebase Storage
      if (product.images && product.images.length > 0) {
        for (const imageUrl of product.images) {
          const fileName = imageUrl.split('/').pop();
          const file = bucket.file(`products/${fileName}`);
          await file
            .delete()
            .catch((err) => console.log('Image deletion error:', err));
        }
      }
    }

    await db.collection('products').doc(id).delete();

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get product categories
router.get('/categories/list', async (req, res) => {
  try {
    const snapshot = await db.collection('categories').get();
    const categories = [];

    snapshot.forEach((doc) => {
      categories.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
