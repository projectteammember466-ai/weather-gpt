import { Router } from 'express';
import { handleChat } from '../controllers/chat.controller.js';
import { validateChatPayload } from '../middleware/validateRequest.js';

const router = Router();

router.post('/', validateChatPayload, handleChat);

export default router;
