import mongoose from "mongoose"
const Schema = mongoose.Schema;

const notificationTemplateSchema = new Schema({
    templateName: { type: String, required: true, unique: true },
    subject: { type: String, required: true },
    body: { type: String, required: true },
    variables: { 
      type: [String], 
      required: true 
    },
    notificationType: { 
      type: String, 
      enum: ['reminder', 'update', 'registration', 'general'], 
      required: true 
    }
  });
  
export const notificationTemplate = mongoose.model('NotificationTemplate', notificationTemplateSchema);