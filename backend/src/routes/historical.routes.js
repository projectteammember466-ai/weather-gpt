import { Router } from 'express';
import { getHistoricalData } from '../controllers/historical.controller.js';
import { validateCoordinates, validateDateRange } from '../middleware/validateRequest.js';

const router = Router();

router.get('/', validateCoordinates, validateDateRange, getHistoricalData);

export default router;
