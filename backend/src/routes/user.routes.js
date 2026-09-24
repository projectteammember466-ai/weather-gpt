import { Router } from 'express';
import userController from '../controllers/user.controller.js';

const router = Router();

// Profile
router.put('/profile', userController.updateProfile);
router.get('/profile/:userId', userController.getProfile);

// Search History
router.post('/search-history', userController.addSearchHistory);
router.get('/search-history/:userId', userController.fetchSearchHistory);

// Saved Locations
router.post('/saved-locations', userController.addSavedLocation);
router.get('/saved-locations/:userId', userController.fetchSavedLocations);
router.delete('/saved-locations/:userId/:locationId', userController.removeSavedLocation);

// Alert Preferences
router.post('/alerts-preferences', userController.saveAlertPreferences);
router.get('/alerts-preferences/:userId', userController.fetchAlertPreferences);

export default router;
