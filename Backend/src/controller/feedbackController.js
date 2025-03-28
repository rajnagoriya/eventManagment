import { Feedback } from '../model/feedbackSchema.js';
import { Event } from '../model/eventSchema.model.js';
import mongoose from 'mongoose';
import { EventRegistration } from '../model/eventRegistrationSchema.js';

/**
 * @desc    Submit feedback for an event
 * @route   POST /api/feedback
 * @access  Private
 */
const submitFeedback = async (req, res) => {
  const { eventId, rating, comments } = req.body;
  const userId = req.user._id;

  // Validate input
  if (!eventId || !mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ success: false, message: 'Valid event ID is required' });
  }

  if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
    return res.status(400).json({ 
      success: false, 
      message: 'Rating must be a number between 1 and 5' 
    });
  }

  try {
    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Check if user already submitted feedback for this event
    const existingFeedback = await Feedback.findOne({ 
      event: eventId, 
      user: userId 
    });

    if (existingFeedback) {
      return res.status(409).json({ 
        success: false, 
        message: 'Feedback already submitted for this event' 
      });
    }

    // Create new feedback
    const feedback = await Feedback.create({
      event: eventId,
      user: userId,
      rating,
      comments
    });

    // Update event registration to mark feedback as submitted
    await EventRegistration.findOneAndUpdate(
      { event: eventId, user: userId },
      { feedbackSubmitted: true }
    );

    res.status(201).json({
      success: true,
      data: feedback,
    });
  } catch (error) {
    console.error(`[Feedback] Error submitting feedback: ${error.message}`);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Get feedback for an event (Admin only)
 * @route   GET /api/feedback/event/:eventId
 * @access  Private/Admin
 */
const getEventFeedback = async (req, res) => {
  const { eventId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ success: false, message: 'Invalid event ID' });
  }

  try {
    const feedback = await Feedback.find({ event: eventId })
      .populate('user', 'name email')
      .select('-__v')
      .lean();

    res.status(200).json({
      success: true,
      count: feedback.length,
      data: feedback,
    });
  } catch (error) {
    console.error(`[Feedback] Error fetching event feedback: ${error.message}`);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Analyze event feedback (Admin only)
 * @route   GET /api/feedback/analyze/:eventId
 * @access  Private/Admin
 */
const analyzeEventFeedback = async (req, res) => {
    const { eventId } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ success: false, message: 'Invalid event ID' });
    }
  
    try {
      const feedbackStats = await Feedback.aggregate([
        { 
          $match: { 
            event: new mongoose.Types.ObjectId(eventId)
          } 
        },
        {
          $group: {
            _id: null,
            averageRating: { $avg: '$rating' },
            totalFeedback: { $sum: 1 },
            ratingDistribution: {
              $push: {
                rating: '$rating'
              }
            }
          }
        },
        {
          $project: {
            _id: 0,
            averageRating: { $round: ['$averageRating', 2] },
            totalFeedback: 1,
            ratingDistribution: {
              $reduce: {
                input: '$ratingDistribution',
                initialValue: { 
                  "1": 0, 
                  "2": 0, 
                  "3": 0, 
                  "4": 0, 
                  "5": 0 
                },
                in: {
                  $mergeObjects: [
                    '$$value',
                    {
                      $let: {
                        vars: {
                          currentRating: { $toString: '$$this.rating' }
                        },
                        in: {
                          $arrayToObject: [
                            [
                              [
                                '$$currentRating',
                                { $add: [
                                  { $ifNull: [
                                    { $arrayElemAt: [
                                      { $objectToArray: '$$value' },
                                      { $subtract: ['$$this.rating', 1] }
                                    ]},
                                    0
                                  ]},
                                  1
                                ]}
                              ]
                            ]
                          ]
                        }
                      }
                    }
                  ]
                }
              }
            }
          }
        }
      ]);
  
      if (feedbackStats.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No feedback found for this event'
        });
      }
  
      res.status(200).json({
        success: true,
        data: feedbackStats[0]
      });
    } catch (error) {
      console.error(`[Feedback] Error analyzing feedback: ${error.message}`);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  };

export {
  submitFeedback,
  getEventFeedback,
  analyzeEventFeedback
};