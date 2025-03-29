import express from 'express';
import  requireAuth  from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createEvent, deleteEvent, getAllEvents, getEventById, updateEvent } from '../controller/eventController.js';
import upload from '../middleware/upload.js';

const router = express.Router();



router.post(
  '/create',
  requireAuth,
  requireAdmin,
  upload.single('image'), // Handle file upload
  asyncHandler(createEvent)
);

router.patch(
  '/update/:id',
  requireAuth,
  requireAdmin,
  upload.single('image'),
  asyncHandler(updateEvent)
);

router.get(
  '/:id',
  asyncHandler(getEventById)
);

router.get(
  '/',
  asyncHandler(getAllEvents)
);

router.delete(
  '/delete/:id',
  requireAuth,
  requireAdmin,
  asyncHandler(deleteEvent)
);

export default router;