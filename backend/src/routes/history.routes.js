import { Router } from 'express';
import { 
  getSearchHistory, 
  addSearchHistory, 
  deleteSearchHistory,
  getChatHistory, 
  addChatHistory 
} from '../controllers/history.controller.js';

const router = Router();

// Search history (Section 18 & 29)
router.get('/search', getSearchHistory);
router.post('/search', addSearchHistory);
router.delete('/search/:searchId', deleteSearchHistory);

// Chat history (Section 19 & 29)
router.get('/chat', getChatHistory);
router.post('/chat', addChatHistory);

export default router;
