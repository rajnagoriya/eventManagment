// Helper function to generate token
import jwt from "jsonwebtoken"



export const generateToken = (userId, role) => {
    const JWT_SECRET = process.env.JWT_SECRET ;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
  return jwt.sign({ id: userId, role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
};