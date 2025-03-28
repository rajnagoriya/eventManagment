import mongoose from "mongoose"
const Schema = mongoose.Schema;

const feedbackSchema = new Schema({
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
    rating: { 
      type: Number, 
      min: 1, 
      max: 5, 
      required: true 
    },
    comments: { type: String },
    submissionDate: { type: Date, default: Date.now }
  });
  
export const Feedback = mongoose.model('Feedback', feedbackSchema);