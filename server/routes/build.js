const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Build = require('../models/Build');
const Product = require('../models/Product');

// Helper function to get or create a build for the user
const getMyBuild = async (userId) => {
  let build = await Build.findOne({ user: userId });
  if (!build) {
    // If no build, create an empty one
    build = new Build({ user: userId, products: [] });
    await build.save();
  }
  return build;
};

// --- GET MY BUILD ---
// @route   GET /api/build
// @desc    Get the logged-in user's build
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const build = await getMyBuild(req.user.id);
    // 'populate' swaps the product IDs with the actual product data
    await build.populate('products');
    res.json(build);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- ADD A PRODUCT TO MY BUILD ---
// @route   POST /api/build/add/:productId
// @desc    Add a product to the user's build
// @access  Private
router.post('/add/:productId', auth, async (req, res) => {
  try {
    const build = await getMyBuild(req.user.id);
    const productId = req.params.productId;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    
    // Add to array if it's not already there
    if (!build.products.includes(productId)) {
      build.products.push(productId);
      await build.save();
    }
    await build.populate('products');
    res.json(build);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- REMOVE A PRODUCT FROM MY BUILD ---
// @route   DELETE /api/build/remove/:productId
// @desc    Remove a product from the user's build
// @access  Private
router.delete('/remove/:productId', auth, async (req, res) => {
  try {
    const build = await getMyBuild(req.user.id);

    // Filter out the product to be removed
    build.products = build.products.filter(
      (pid) => pid.toString() !== req.params.productId
    );
    
    await build.save();
    await build.populate('products');
    res.json(build);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;