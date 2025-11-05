const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  // We REMOVED the 'user' field
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      'CPU',
      'GPU',
      'Monitor',
      'Keyboard',
      'Mouse',
      'Motherboard',
      'RAM',
      'Storage',
      'Case',
      'Other',
    ],
    default: 'Other',
  },
  productUrl: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  // --- THIS IS NEW ---
  // Replaces the priceHistory array
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  // --- THIS IS NEW ---
  rating: {
    type: Number,
    default: 0,
  },
  // We REMOVED the 'priceHistory' array
  
  model3DUrl: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Product', ProductSchema);