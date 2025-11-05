const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./db');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// --- Middlewares ---
// Enable CORS so your frontend (Vercel) can call the API
app.use(cors({
  origin: [
    'https://your-frontend.vercel.app', // 👈 replace with your actual Vercel domain
    'http://localhost:5173'             // for local development (Vite)
  ],
  credentials: true
}));

// Parse JSON bodies
app.use(express.json());

// --- Routes ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/build', require('./routes/build'));

// --- Health Check Route ---
app.get('/', (req, res) => {
  res.send('Backend is live 🚀');
});

// --- Start the Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server started on port ${PORT}`));
