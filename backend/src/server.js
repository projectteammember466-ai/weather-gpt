import app from './app.js';
import config from './config/env.js';
import logger from './utils/logger.utils.js';

const PORT = process.env.PORT || config.port || 10000;

const server = app.listen(PORT, '0.0.0.0', () => {
  logger.info(`WeatherGPT Backend running on port ${PORT} in [${config.nodeEnv}] mode`);
  logger.info(`Health check available at http://0.0.0.0:${PORT}/api/v1/health`);
});

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err.message);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err.message);
});

export default server;
