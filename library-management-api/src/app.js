const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');
const borrowingRoutes = require('./routes/borrowingRoutes');
const authorRoutes = require('./routes/authorRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// --- Experiment 2: Load Balancing Simulation ---
const SERVER_NAME = process.env.SERVER_NAME || 'Backend-Unknown';
const DELAY = parseFloat(process.env.DELAY || '0') * 1000; // Convert seconds to ms

// Delay middleware to simulate heterogeneous server processing times
app.use((req, res, next) => {
  if (DELAY > 0) {
    setTimeout(next, DELAY);
  } else {
    next();
  }
});

// Health endpoint for load balancer traffic identification
app.get('/health', (req, res) => {
  res.json({ server: SERVER_NAME, delay: parseFloat(process.env.DELAY || '0') });
});
// --- End Experiment 2 ---

app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/borrowings', borrowingRoutes);
app.use('/api/authors', authorRoutes);

// Handle 404
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handling middleware
app.use(errorHandler);

module.exports = app;
