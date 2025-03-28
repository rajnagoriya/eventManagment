import mongoose from "mongoose"
const Schema = mongoose.Schema;

const eventRegistrationSchema = new Schema({
    event: { 
      type: Schema.Types.ObjectId, 
      ref: 'Event', 
      required: true 
    },
    user: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    registrationDate: { type: Date, default: Date.now },
    attendanceStatus: { 
      type: String, 
      enum: ['registered', 'attended', 'no_show'], 
      default: 'registered' 
    },
   
    feedbackSubmitted: { type: Boolean, default: false }
  });
  
  // Ensure a user can only register once for an event
  eventRegistrationSchema.index({ event: 1, user: 1 }, { unique: true });
  
export const EventRegistration = mongoose.model('EventRegistration', eventRegistrationSchema);