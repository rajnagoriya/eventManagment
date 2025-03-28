import mongoose from "mongoose"
const Schema = mongoose.Schema;

const reminderScheduleSchema = new Schema({
    event: { 
      type: Schema.Types.ObjectId, 
      ref: 'Event', 
      required: true 
    },
    reminderType: { 
      type: String, 
      enum: ['registration_deadline', 'event_start', 'custom'], 
      required: true 
    },
    offsetHours: { 
      type: Number, 
      required: true,
      comment: 'Hours before the event/date to send reminder' 
    },
    template: { 
      type: Schema.Types.ObjectId, 
      ref: 'NotificationTemplate', 
      required: true 
    },
    isActive: { type: Boolean, default: true }
  });

export const ReminderSchedule  = mongoose.model('ReminderSchedule', reminderScheduleSchema);