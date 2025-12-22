require('dotenv').config(); // Load variables first!
const express = require('express');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');

// Import Routes
const summaryRoutes = require('./routes/summary');
const mcqRoutes = require('./routes/mcq');
const flashcardRoutes = require('./routes/flashcard');

const app = express();
const PORT = process.env.PORT || 5000;

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: { error: "Too many requests, please try again later." }
});

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/', apiLimiter);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/summary', summaryRoutes);
app.use('/api/mcq', mcqRoutes);
app.use('/api/flashcards', flashcardRoutes);

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Backend is running',
    environment: process.env.NODE_ENV || 'development'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Summary API: http://localhost:${PORT}/api/summary/upload`);
});
