const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./db');

// Load env variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// --- Middlewares ---
// Enable CORS (Cross-Origin Resource Sharing)
app.use(cors());
// Body parser: allows us to accept JSON data in the body
app.use(express.json());


// --- Define Routes ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/build', require('./routes/build'));
// We will add more routes here later (e.g., '/api/products')


// --- Start the Server ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));