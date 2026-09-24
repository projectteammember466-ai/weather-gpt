import express from 'express';
import cors from 'cors';
import config from './config/env.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

// Import Routes
import healthRoutes from './routes/health.routes.js';
import weatherRoutes from './routes/weather.routes.js';
import forecastRoutes from './routes/forecast.routes.js';
import historicalRoutes from './routes/historical.routes.js';
import locationRoutes from './routes/location.routes.js';
import chatRoutes from './routes/chat.routes.js';
import userRoutes from './routes/user.routes.js';

const app = express();

// CORS Configuration
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or postman)
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
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount API Endpoints under /api/v1
app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/weather', weatherRoutes);
app.use('/api/v1/forecast', forecastRoutes);
app.use('/api/v1/historical', historicalRoutes);
app.use('/api/v1/locations', locationRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/user', userRoutes);

// Root route summary
app.get('/', (req, res) => {
  res.json({
    service: "WeatherGPT REST API Backend",
    version: "1.0.0",
    docs: "/api/v1/health"
  });
});

// 404 Handler
app.use(notFoundHandler);

// Central Error Handler
app.use(errorHandler);

export default app;
