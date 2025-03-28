// validation/eventValidation.js
const { z } = require('zod');

const eventTypes = ['workshop', 'seminar', 'competition', 'cultural', 'sports', 'conference'];

const createEventSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required").max(100),
    description: z.string().max(1000).optional(),
    eventType: z.enum(eventTypes),
    startDateTime: z.coerce.date().refine(date => date > new Date(), {
      message: "Start date must be in the future"
    }),
    endDateTime: z.coerce.date().refine((date, ctx) => {
      return date > ctx.parent.startDateTime;
    }, {
      message: "End date must be after start date"
    }),
    location: z.string().min(1, "Location is required").max(200),
    organizer: z.string().min(1, "Organizer ID is required"),
    maxParticipants: z.number().int().positive().optional(),
    registrationDeadline: z.coerce.date()
      .refine(date => date > new Date(), {
        message: "Registration deadline must be in the future"
      })
      .refine((date, ctx) => {
        return date < ctx.parent.startDateTime;
      }, {
        message: "Registration deadline must be before the event starts"
      })
      .optional(),
    imageUrl: z.string().url().optional(),
    isActive: z.boolean().optional()
  })
});

const updateEventSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(100).optional(),
    description: z.string().max(1000).optional(),
    eventType: z.enum(eventTypes).optional(),
    startDateTime: z.coerce.date().optional(),
    endDateTime: z.coerce.date().optional(),
    location: z.string().min(1).max(200).optional(),
    maxParticipants: z.number().int().positive().optional(),
    registrationDeadline: z.coerce.date().optional(),
    imageUrl: z.string().url().optional(),
    isActive: z.boolean().optional()
  }).refine(data => {
    if (data.startDateTime && data.endDateTime) {
      return data.endDateTime > data.startDateTime;
    }
    return true;
  }, {
    message: "End date must be after start date",
    path: ["endDateTime"]
  }).refine(data => {
    if (data.startDateTime && data.registrationDeadline) {
      return data.registrationDeadline < data.startDateTime;
    }
    return true;
  }, {
    message: "Registration deadline must be before the event starts",
    path: ["registrationDeadline"]
  })
});

const registerForEventSchema = z.object({
  body: z.object({
    userId: z.string().min(1, "User ID is required")
  })
});

export default{
  createEventSchema,
  updateEventSchema,
  registerForEventSchema
};