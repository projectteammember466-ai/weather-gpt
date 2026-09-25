import express from 'express';
import cors from 'cors';
import config from './config/env.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { chatRateLimiter, apiRateLimiter } from './middleware/rateLimiter.js';

// Import Routes
import healthRoutes from './routes/health.routes.js';
import weatherRoutes from './routes/weather.routes.js';
import forecastRoutes from './routes/forecast.routes.js';
import historicalRoutes from './routes/historical.routes.js';
import locationRoutes from './routes/location.routes.js';
import alertRoutes from './routes/alert.routes.js';
import chatRoutes from './routes/chat.routes.js';
import historyRoutes from './routes/history.routes.js';
import userRoutes from './routes/user.routes.js';

const app = express();

// Security Headers Middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// CORS Configuration
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    const isAllowed = config.corsOrigins.some(allowedOrigin => {
      return origin === allowedOrigin || origin.startsWith(allowedOrigin);
    });

    if (isAllowed || !config.isProduction) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

// Global API rate limiting
app.use('/api/v1', apiRateLimiter);

// Dedicated rate limiting for AI chat endpoint
app.use('/api/v1/chat', chatRateLimiter);

// Mount API Endpoints under /api/v1
app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/weather', weatherRoutes);
app.use('/api/v1/forecast', forecastRoutes);
app.use('/api/v1/historical', historicalRoutes);
app.use('/api/v1/locations', locationRoutes);
app.use('/api/v1/alerts', alertRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/history', historyRoutes);
app.use('/api/v1/user', userRoutes);

// Root route summary
app.get('/', (req, res) => {
  res.json({
    service: "WeatherGPT REST API Backend",
    version: "1.0.0",
    health: "/api/v1/health"
  });
});

// 404 Handler
app.use(notFoundHandler);

// Central Error Handler
app.use(errorHandler);

export default app;
