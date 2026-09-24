import { Router } from 'express';
import { getWeather } from '../controllers/weather.controller.js';
import { validateCoordinates } from '../middleware/validateRequest.js';

const router = Router();

router.get('/', validateCoordinates, getWeather);

export default router;
