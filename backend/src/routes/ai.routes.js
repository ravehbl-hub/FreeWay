// /api/ai - Gemini features. Every route needs login, and is rate limited (aiLimiter).
import { Router } from 'express';
import { body, param } from 'express-validator';
import { requireAuth } from '../middleware/auth.js';
import { aiLimiter } from '../middleware/rateLimit.js';
import { validate } from '../middleware/validate.js';
import * as aiChatController from '../controllers/aiChat.controller.js';
import * as aiRecommendationsController from '../controllers/aiRecommendations.controller.js';

const router = Router();
router.use(requireAuth);

const chatRules = [
  body('message').trim().isLength({ min: 1, max: 1000 }).withMessage('Message must be 1-1000 characters'),
  body('conversationId').optional({ values: 'null' }).isInt().withMessage('Invalid conversation id').toInt(),
];
const idRule = param('id').isInt().withMessage('Invalid conversation id').toInt();

// Chat with the assistant
router.post('/chat', aiLimiter, chatRules, validate, aiChatController.chat);
router.post('/chat/stream', aiLimiter, chatRules, validate, aiChatController.chatStream);

// Saved conversations (reading from the DB - no Gemini call, so no AI limiter)
router.get('/conversations', aiChatController.listConversations);
router.get('/conversations/:id/messages', [idRule], validate, aiChatController.getMessages);
router.delete('/conversations/:id', [idRule], validate, aiChatController.deleteConversation);

// "Recommended for you"
router.get('/recommendations', aiRecommendationsController.getSaved);
router.post('/recommendations', aiLimiter, aiRecommendationsController.generate);

export default router;
