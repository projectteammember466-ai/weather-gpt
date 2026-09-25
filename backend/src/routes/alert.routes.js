import { Router } from 'express';
import { getAlerts } from '../controllers/alert.controller.js';

const router = Router();

router.get('/', getAlerts);

export default router;
