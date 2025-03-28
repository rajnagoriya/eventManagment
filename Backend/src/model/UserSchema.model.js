import mongoose from "mongoose"
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  passwordHash: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { 
    type: String, 
    required: true,
    enum: ['student', 'admin'] 
  },
  collegeId: { type: String },
  department: { type: String },
  phoneNumber: { type: String },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date }
},{
  timestamps: true
}
);

export const User = mongoose.model('User', userSchema);