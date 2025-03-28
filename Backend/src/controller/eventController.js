import { Event } from '../model/eventSchema.model.js';
import ApiError from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import cloudinary from '../config/cloudinary.js';

// const createEvent = async (req, res) => {
//     try {
//         // Extract data from request body
//         const {
//             title,
//             description,
//             eventType,
//             startDateTime,
//             endDateTime,
//             location,
//             maxParticipants,
//             registrationDeadline
//         } = req.body;

//         // Check for required fields
//         if (!title || !eventType || !startDateTime || !endDateTime || !location) {
//             throw new ApiError(400, 'Title, event type, start date, end date, and location are required');
//         }

//         // Validate dates
//         const startDate = new Date(startDateTime);
//         const endDate = new Date(endDateTime);
//         const currentDate = new Date();
        
//         if (isNaN(startDate.getTime())) {
//             throw new ApiError(400, 'Invalid start date');
//         }

//         if (isNaN(endDate.getTime())) {
//             throw new ApiError(400, 'Invalid end date');
//         }
        
//         // Check if dates are in the past
//         if (startDate < currentDate) {
//             throw new ApiError(400, 'Start date cannot be in the past');
//         }
        
//         if (endDate < currentDate) {
//             throw new ApiError(400, 'End date cannot be in the past');
//         }
        
//         if (startDate >= endDate) {
//             throw new ApiError(400, 'End date must be after start date');
//         }

//         // Validate registration deadline if provided
//         if (registrationDeadline) {
//             const deadlineDate = new Date(registrationDeadline);
//             if (isNaN(deadlineDate.getTime())) {
//                 throw new ApiError(400, 'Invalid registration deadline date');
//             }
//             if (deadlineDate < currentDate) {
//                 throw new ApiError(400, 'Registration deadline cannot be in the past');
//             }
//             if (deadlineDate > startDate) {
//                 throw new ApiError(400, 'Registration deadline must be before the event starts');
//             }
//         }

//         // Validate maxParticipants if provided
//         if (maxParticipants && (isNaN(maxParticipants) || maxParticipants <= 0)) {
//             throw new ApiError(400, 'Max participants must be a positive number');
//         }

//         // Get image URL if file was uploaded
//         const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

//         // Create the event
//         const event = await Event.create({
//             title,
//             description,
//             eventType,
//             startDateTime: startDate,
//             endDateTime: endDate,
//             location,
//             organizer: req.user._id, // From auth middleware
//             maxParticipants,
//             registrationDeadline: registrationDeadline ? new Date(registrationDeadline) : undefined,
//             imageUrl
//         });

//         // Return success response
//         return res.status(201).json(
//             new ApiResponse(201, event, 'Event created successfully')
//         );
//     } catch (error) {
//         // Handle Mongoose validation errors
//         if (error.name === 'ValidationError') {
//             const errors = Object.values(error.errors).map(err => err.message);
//             throw new ApiError(400, `Validation failed: ${errors.join(', ')}`);
//         }
//         throw error; // Let the global error handler catch other errors
//     }
// };


const createEvent = async (req, res) => {
    try {
        const {
            title,
            description,
            eventType,
            startDateTime,
            endDateTime,
            location,
            maxParticipants,
            registrationDeadline
        } = req.body;

        if (!title || !eventType || !startDateTime || !endDateTime || !location) {
            throw new ApiError(400, 'Title, event type, start date, end date, and location are required');
        }

        const startDate = new Date(startDateTime);
        const endDate = new Date(endDateTime);
        const currentDate = new Date();
        
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            throw new ApiError(400, 'Invalid date format');
        }
        
        if (startDate < currentDate) {
            throw new ApiError(400, 'Start date cannot be in the past');
        }

        if (endDate <= startDate) {
            throw new ApiError(400, 'End date must be after start date');
        }

        if (registrationDeadline) {
            const deadlineDate = new Date(registrationDeadline);
            if (isNaN(deadlineDate.getTime()) || deadlineDate < currentDate || deadlineDate > startDate) {
                throw new ApiError(400, 'Invalid registration deadline');
            }
        }

        if (maxParticipants && (isNaN(maxParticipants) || maxParticipants <= 0)) {
            throw new ApiError(400, 'Max participants must be a positive number');
        }

        let imageUrl;
        if (req.file) {
            const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
                folder: 'event_images',
                transformation: [{ width: 800, height: 600, crop: 'limit' }],
            });
            imageUrl = uploadedImage.secure_url;
        }

        const event = await Event.create({
            title,
            description,
            eventType,
            startDateTime: startDate,
            endDateTime: endDate,
            location,
            organizer: req.user._id,
            maxParticipants,
            registrationDeadline: registrationDeadline ? new Date(registrationDeadline) : undefined,
            imageUrl
        });

        return res.status(201).json(
            new ApiResponse(201, event, 'Event created successfully')
        );
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            throw new ApiError(400, `Validation failed: ${errors.join(', ')}`);
        }
        throw error;
    }
};



const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title,
            description,
            eventType,
            startDateTime,
            endDateTime,
            location,
            maxParticipants,
            registrationDeadline,
            isActive
        } = req.body;

        // Check if event exists and user is the organizer
        const event = await Event.findById(id);
        if (!event) {
            throw new ApiError(404, 'Event not found');
        }

        // Verify the current user is the organizer or admin
        if (event.organizer.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            throw new ApiError(403, 'Not authorized to update this event');
        }

        // Validate dates if they're being updated
        const currentDate = new Date();
        let startDate = event.startDateTime;
        let endDate = event.endDateTime;

        if (startDateTime) {
            startDate = new Date(startDateTime);
            if (isNaN(startDate.getTime())) {
                throw new ApiError(400, 'Invalid start date');
            }
            if (startDate < currentDate) {
                throw new ApiError(400, 'Start date cannot be in the past');
            }
        }

        if (endDateTime) {
            endDate = new Date(endDateTime);
            if (isNaN(endDate.getTime())) {
                throw new ApiError(400, 'Invalid end date');
            }
            if (endDate < currentDate) {
                throw new ApiError(400, 'End date cannot be in the past');
            }
        }

        if (startDate >= endDate) {
            throw new ApiError(400, 'End date must be after start date');
        }

        // Validate registration deadline if provided
        if (registrationDeadline) {
            const deadlineDate = new Date(registrationDeadline);
            if (isNaN(deadlineDate.getTime())) {
                throw new ApiError(400, 'Invalid registration deadline date');
            }
            if (deadlineDate < currentDate) {
                throw new ApiError(400, 'Registration deadline cannot be in the past');
            }
            if (deadlineDate > startDate) {
                throw new ApiError(400, 'Registration deadline must be before the event starts');
            }
        }

        // Validate maxParticipants if provided
        if (maxParticipants && (isNaN(maxParticipants) || maxParticipants <= 0)) {
            throw new ApiError(400, 'Max participants must be a positive number');
        }

        let newImgUrl = null;
        // Handle image update
        if (req.file) {
            const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
                folder: 'event_images',
                transformation: [{ width: 800, height: 600, crop: 'limit' }],
            });
            newImgUrl = uploadedImage.secure_url;
        }

        // Prepare update object
        const updateData = {
            title: title || event.title,
            description: description !== undefined ? description : event.description,
            eventType: eventType || event.eventType,
            startDateTime: startDate,
            endDateTime: endDate,
            location: location || event.location,
            maxParticipants: maxParticipants !== undefined ? maxParticipants : event.maxParticipants,
            registrationDeadline: registrationDeadline !== undefined 
                ? new Date(registrationDeadline) 
                : event.registrationDeadline,
            isActive: isActive !== undefined ? isActive : event.isActive,
            imageUrl : newImgUrl || imageUrl ,
            updatedAt: Date.now()
        };

        // Update the event
        const updatedEvent = await Event.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true
        });

        if (!updatedEvent) {
            throw new ApiError(500, 'Failed to update event');
        }

        return res.status(200).json(
            new ApiResponse(200, updatedEvent, 'Event updated successfully')
        );
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            throw new ApiError(400, `Validation failed: ${errors.join(', ')}`);
        }
        throw error;
    }
};
const getEventById = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the event and populate organizer details
        const event = await Event.findById(id).populate('organizer', 'username email');

        if (!event) {
            throw new ApiError(404, 'Event not found');
        }

        // Return the event details
        return res.status(200).json(
            new ApiResponse(200, event, 'Event retrieved successfully')
        );
    } catch (error) {
        if (error.name === 'CastError') {
            throw new ApiError(400, 'Invalid event ID format');
        }
        throw error;
    }
};

const getAllEvents = async (req, res) => {
    try {
        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Filtering parameters
        const { eventType, organizer, isActive, fromDate, toDate } = req.query;
        const filter = {};

        if (eventType) {
            filter.eventType = eventType;
        }

        if (organizer) {
            filter.organizer = organizer;
        }

        if (isActive !== undefined) {
            filter.isActive = isActive === 'true';
        }

        if (fromDate || toDate) {
            filter.startDateTime = {};
            if (fromDate) {
                filter.startDateTime.$gte = new Date(fromDate);
            }
            if (toDate) {
                filter.startDateTime.$lte = new Date(toDate);
            }
        }

        // Sorting parameter (default: newest first)
        const sort = req.query.sort || '-createdAt';

        // Text search (if you want to implement search functionality)
        if (req.query.search) {
            filter.$or = [
                { title: { $regex: req.query.search, $options: 'i' } },
                { description: { $regex: req.query.search, $options: 'i' } },
                { location: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        // Get events with filters
        const events = await Event.find(filter)
            .populate('organizer', 'username email')
            .sort(sort)
            .skip(skip)
            .limit(limit);

        // Get total count for pagination info
        const totalEvents = await Event.countDocuments(filter);
        const totalPages = Math.ceil(totalEvents / limit);

        // Response with pagination info
        return res.status(200).json(
            new ApiResponse(200, {
                events,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalEvents,
                    eventsPerPage: limit
                }
            }, 'Events retrieved successfully')
        );
    } catch (error) {
        throw error;
    }
};

const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if event exists
        const event = await Event.findById(id);
        if (!event) {
            throw new ApiError(404, 'Event not found');
        }

        // Verify the current user is the organizer or admin
        if (event.organizer.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            throw new ApiError(403, 'Not authorized to delete this event');
        }

        // Delete the event
        await Event.findByIdAndDelete(id);

        return res.status(200).json(
            new ApiResponse(200, null, 'Event deleted successfully')
        );
    } catch (error) {
        if (error.name === 'CastError') {
            throw new ApiError(400, 'Invalid event ID format');
        }
        throw error;
    }
};

export { 
    createEvent, 
    updateEvent, 
    getEventById, 
    deleteEvent, 
    getAllEvents 
};


// import { Event } from '../model/eventSchema.model.js';
// import ApiError from '../utils/ApiError.js';
// import { ApiResponse } from '../utils/ApiResponse.js';

// const createEvent = (async (req, res) => {
//     // Extract data from request body
//     const {
//         title,
//         description,
//         eventType,
//         startDateTime,
//         endDateTime,
//         location,
//         maxParticipants,
//         registrationDeadline
//     } = req.body;

//     // Check for required fields
//     if (!title || !eventType || !startDateTime || !endDateTime || !location) {
//         throw new ApiError(400, 'Title, event type, start date, end date, and location are required');
//     }

//     // Validate dates
//     const startDate = new Date(startDateTime);
//     const endDate = new Date(endDateTime);
    
    
//     if (isNaN(startDate.getTime())) {
//         throw new ApiError(400, 'Invalid start date');
//     }

//     if (isNaN(endDate.getTime())) {
//         throw new ApiError(400, 'Invalid end date');
//     }
    
//     if (startDate >= endDate) {
//         throw new ApiError(400, 'End date must be after start date');
//     }

//     // Validate registration deadline if provided
//     if (registrationDeadline) {
//         const deadlineDate = new Date(registrationDeadline);
//         if (isNaN(deadlineDate.getTime())) {
//             throw new ApiError(400, 'Invalid registration deadline date');
//         }
//         if (deadlineDate > startDate) {
//             throw new ApiError(400, 'Registration deadline must be before the event starts');
//         }
//     }

//     // Validate maxParticipants if provided
//     if (maxParticipants && (isNaN(maxParticipants) || maxParticipants <= 0)) {
//         throw new ApiError(400, 'Max participants must be a positive number');
//     }

//     // Get image URL if file was uploaded
//     const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

//     // Create the event
//     const event = await Event.create({
//         title,
//         description,
//         eventType,
//         startDateTime: startDate,
//         endDateTime: endDate,
//         location,
//         organizer: req.user._id, // From auth middleware
//         maxParticipants,
//         registrationDeadline: registrationDeadline ? new Date(registrationDeadline) : undefined,
//         imageUrl
//     });

//     // Return success response
//     return res.status(201).json(
//         new ApiResponse(201, event, 'Event created successfully')
//     );
// });

// export { createEvent };