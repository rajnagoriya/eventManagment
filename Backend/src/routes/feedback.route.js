import express from 'express';
import requireAuth from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';
import { analyzeEventFeedback, getEventFeedback, submitFeedback } from '../controller/feedbackController.js';
import { asyncHandler } from '../utils/asyncHandler.js';


const router = express.Router();

router.post('/', requireAuth,asyncHandler( submitFeedback));
router.get('/event/:eventId', requireAuth, requireAdmin, asyncHandler(getEventFeedback));
// analyze drop for nao
// router.get('/analyze/:eventId', requireAuth, requireAdmin, asyncHandler(analyzeEventFeedback));

export default router;