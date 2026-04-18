/**
 * Application entry point configuring Express, CORS, JSON parsing,
 * employee routes, and the centralized error handler middleware.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const employeeRoutes = require('./routes/employeeRoutes');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

const port = Number(process.env.PORT) || 5000;
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:3000';

/**
 * Attaches core middleware shared across all routes
 * @returns {void}
 */
const registerCoreMiddleware = () => {
  app.use(
    cors({
      origin: clientOrigin,
    })
  );
  app.use(express.json({ limit: '1mb' }));
};

/**
 * Registers HTTP routes for the service
 * @returns {void}
 */
const registerRoutes = () => {
  app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
  });
  app.use('/api/employees', employeeRoutes);
};

/**
 * Registers the not-found handler and global error middleware last
 * @returns {void}
 */
const registerErrorHandlers = () => {
  app.use((req, res, next) => {
    res.status(404).json({ statusCode: 404, message: 'Route not found' });
  });
  app.use(errorHandler);
};

/**
 * Starts the HTTP server on the configured port
 * @returns {void}
 */
const startServer = () => {
  registerCoreMiddleware();
  registerRoutes();
  registerErrorHandlers();

  app.listen(port, () => {
    console.log(`Employee Directory API listening on port ${port}`);
  });
};

startServer();
