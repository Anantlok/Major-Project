const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BuildSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // Each user can only have one build
  },
  products: [
    {
      // This is an array of IDs
      type: Schema.Types.ObjectId,
      ref: 'Product', // Links to the Product model
    },
  ],
});

module.exports = mongoose.model('Build', BuildSchema);