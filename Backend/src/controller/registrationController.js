import { EventRegistration } from '../model/eventRegistrationSchema.js';
import { Event } from '../model/eventSchema.model.js';
import { User } from '../model/UserSchema.model.js';
import mongoose from 'mongoose';

/**
 * @desc    Register a user for an event
 * @route   POST /api/event-registrations
 * @access  Private
 */
const registerForEvent = async (req, res) => {
  const { eventId } = req.body;
  const userId = req.user._id; // Assuming user is authenticated and user ID is available

  // Validate input
  if (!eventId || !mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ success: false, message: 'Valid event ID is required' });
  }

  try {
    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Check if registration already exists
    const existingRegistration = await EventRegistration.findOne({ 
      event: eventId, 
      user: userId 
    });

    if (existingRegistration) {
      return res.status(409).json({ 
        success: false, 
        message: 'User is already registered for this event' 
      });
    }

    // Create new registration
    const registration = await EventRegistration.create({
      event: eventId,
      user: userId,
    });

    res.status(201).json({
      success: true,
      data: registration,
    });
  } catch (error) {
    console.error(`[EventRegistration] Error registering for event: ${error.message}`);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Get all registrations for an event
 * @route   GET /api/event-registrations/event/:eventId
 * @access  Private/Admin
 */
const getRegistrationsForEvent = async (req, res) => {
  const { eventId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ success: false, message: 'Invalid event ID' });
  }

  try {
    const registrations = await EventRegistration.find({ event: eventId })
      .populate('user', 'name email') // Only include necessary user fields
      .lean();

    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations,
    });
  } catch (error) {
    console.error(`[EventRegistration] Error fetching registrations: ${error.message}`);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Get all events a user is registered for
 * @route   GET /api/event-registrations/user/:userId
 * @access  Private
 */
const getEventsForUser = async (req, res) => {
  const { userId } = req.params;

  // Allow users to view their own registrations or admin to view any
  if (userId !== req.user._id.toString() && !req.user.isAdmin) {
    return res.status(403).json({ 
      success: false, 
      message: 'Not authorized to view these registrations' 
    });
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ success: false, message: 'Invalid user ID' });
  }

  try {
    const registrations = await EventRegistration.find({ user: userId })
      .populate({
        path: 'event',
        select: 'title date location description'
      })
      .lean();

    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations,
    });
  } catch (error) {
    console.error(`[EventRegistration] Error fetching user registrations: ${error.message}`);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Update registration status (e.g., mark as attended)
 * @route   PATCH /api/event-registrations/:id
 * @access  Private/Admin
 */
const updateRegistrationStatus = async (req, res) => {
  const { id } = req.params;
  const { attendanceStatus } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid registration ID' });
  }

  if (!attendanceStatus || !['registered', 'attended', 'no_show'].includes(attendanceStatus)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Valid attendance status is required' 
    });
  }

  try {
    const registration = await EventRegistration.findByIdAndUpdate(
      id,
      { attendanceStatus },
      { new: true, runValidators: true }
    ).populate('user event');

    if (!registration) {
      return res.status(404).json({ 
        success: false, 
        message: 'Registration not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: registration,
    });
  } catch (error) {
    console.error(`[EventRegistration] Error updating registration: ${error.message}`);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


/**
 * @desc    Cancel a registration
 * @route   DELETE /api/event-registrations/:id
 * @access  Private
 */
const cancelRegistration = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid registration ID' });
  }

  try {
    const registration = await EventRegistration.findById(id);

    if (!registration) {
      return res.status(404).json({ 
        success: false, 
        message: 'Registration not found' 
      });
    }

    // Check if the user owns the registration or is admin
    if (registration.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to cancel this registration' 
      });
    }

    await registration.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
      message: 'Registration cancelled successfully',
    });
  } catch (error) {
    console.error(`[EventRegistration] Error cancelling registration: ${error.message}`);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export {
  registerForEvent,
  getRegistrationsForEvent,
  getEventsForUser,
  updateRegistrationStatus,
  cancelRegistration,
};