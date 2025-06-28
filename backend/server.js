const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
require('dotenv').config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/residents', require('./routes/residents'));
app.use('/api/schemes', require('./routes/schemes'));
app.use('/api/eligibility', require('./routes/eligibility'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'SmartGraama API is running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
