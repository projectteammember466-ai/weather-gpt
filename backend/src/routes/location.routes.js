import { Router } from 'express';
import { search } from '../controllers/location.controller.js';
import { validateLocationQuery } from '../middleware/validateRequest.js';

const router = Router();

router.get('/search', validateLocationQuery, search);

export default router;
