import express from 'express';
import requireAuth from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';
import { sendEmailToRegisteredUsers } from '../controller/reminderController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

// POST /api/events/:eventId/send-emails
router.post('/:eventId/send-emails',requireAuth,requireAdmin , asyncHandler(sendEmailToRegisteredUsers));

export default router;