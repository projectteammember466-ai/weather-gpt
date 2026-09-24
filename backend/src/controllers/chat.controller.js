import { successResponse } from '../utils/response.utils.js';
import { processChat } from '../services/chat.service.js';
import { saveChatMessage } from '../services/firestore.service.js';

export async function handleChat(req, res, next) {
  try {
    const { message, location, contextMode, language, userId, sessionId } = req.body;

    const chatResult = await processChat({ message, location, contextMode, language });

    // Optionally save to Firestore chatHistory if userId provided
    if (userId) {
      try {
        await saveChatMessage(userId, {
          sessionId,
          message,
          response: chatResult.reply,
          intent: chatResult.intent,
          location: chatResult.location
        });
      } catch (saveErr) {
        // Log error silently, do not fail chat response
      }
    }

    return successResponse(res, chatResult);
  } catch (err) {
    next(err);
  }
}

export default {
  handleChat
};
