const fs = require('fs'); // Node.js file system module
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load our models and DB connection
const connectDB = require('./db');
const Product = require('./models/Product');

// Load .env variables
dotenv.config();

// Connect to the database
connectDB();

// Read the JSON file
const products = JSON.parse(
  fs.readFileSync(`${__dirname}/products.json`, 'utf-8')
);

// --- IMPORT FUNCTION ---
const importData = async () => {
  try {
    // Clear existing products
    await Product.deleteMany();
    
    // Insert the new products from our file
    await Product.insertMany(products);

    console.log('Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error importing data: ${error}`);
    process.exit(1);
  }
};

// --- DESTROY FUNCTION ---
const destroyData = async () => {
  try {
    // Clear existing products
    await Product.deleteMany();
    
    console.log('Data Destroyed Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error destroying data: ${error}`);
    process.exit(1);
  }
};

// --- SCRIPT EXECUTION ---
// This checks the command you run in the terminal
if (process.argv[2] === '-i') {
  // If you run "node seeder.js -i"
  importData();
} else if (process.argv[2] === '-d') {
  // If you run "node seeder.js -d"
  destroyData();
}
