const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin'); // Import our new admin middleware
const Product = require('../models/Product'); // Import the updated Product model

// --- ADD A NEW PRODUCT (Admin Only) ---
// @route   POST /api/products/add
// @desc    Add a new product to the catalog
// @access  Admin
router.post('/add', [auth, isAdmin], async (req, res) => {
  // 'auth' runs, then 'isAdmin' runs, then this code runs.
  const { title, productUrl, imageUrl, price, model3DUrl, category } = req.body;

  try {
    const newProduct = new Product({
      title,
      productUrl,
      imageUrl,
      price,
      model3DUrl: model3DUrl || '',
      category,
    });

    const product = await newProduct.save();
    res.json(product); // Send the new product back
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- GET ALL PRODUCTS (For all logged-in users) ---
// @route   GET /api/products
// @desc    Get all products from the catalog
// @access  Private (all logged-in users)
router.get('/', auth, async (req, res) => {
  try {
    // Find all products
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- DELETE A PRODUCT (Admin Only) ---
// @route   DELETE /api/products/:id
// @desc    Delete a product from the catalog
// @access  Admin
router.delete('/:id', [auth, isAdmin], async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    // No need to check ownership, only admins can get here
    await Product.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Product removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;