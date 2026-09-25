import { Router } from 'express';
import { search, getSavedLocations, addSavedLocation, deleteSavedLocation } from '../controllers/location.controller.js';
import { validateLocationQuery } from '../middleware/validateRequest.js';

const router = Router();

// Search
router.get('/search', validateLocationQuery, search);

// Saved Locations (Section 17 & 29)
router.get('/saved', getSavedLocations);
router.post('/saved', addSavedLocation);
router.delete('/saved/:id', deleteSavedLocation);
router.delete('/saved/:userId/:id', deleteSavedLocation);

export default router;
