import { Router } from 'express';
import { getForecastData } from '../controllers/forecast.controller.js';
import { validateCoordinates } from '../middleware/validateRequest.js';

const router = Router();

router.get('/', validateCoordinates, getForecastData);

export default router;
