import mongoose from "mongoose"
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    eventType: { 
      type: String, 
      required: true,
      enum: ['workshop', 'seminar', 'competition', 'cultural', 'sports', 'conference'] 
    },
    startDateTime: { type: Date, required: true },
    endDateTime: { type: Date, required: true },
    location: { type: String, required: true },
    organizer: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    maxParticipants: { type: Number },
    currentParticipants: { type: Number, default: 0 },
    registrationDeadline: { type: Date },
    isActive: { type: Boolean, default: true },
    imageUrl: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },{
    timestamps: true
  });
  
  eventSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
  });
  
 export const  Event = mongoose.model('Event', eventSchema);