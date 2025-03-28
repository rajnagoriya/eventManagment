import express from 'express';
import requireAuth from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';
import { cancelRegistration, getEventsForUser, getRegistrationsForEvent, registerForEvent, updateRegistrationStatus } from '../controller/registrationController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

router.post('/', requireAuth, asyncHandler(registerForEvent));
router.get('/event/:eventId', requireAuth, requireAdmin, asyncHandler(getRegistrationsForEvent));
router.get('/user/:userId', requireAuth, asyncHandler(getEventsForUser));
// status update not for now 
// router.patch('/:id', requireAuth, requireAdmin, asyncHandler(updateRegistrationStatus));
router.delete('/:id', requireAuth, asyncHandler(cancelRegistration));

export default router;