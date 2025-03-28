// middleware/adminMiddleware.js
import { User } from '../model/UserSchema.model.js';

export const requireAdmin = async (req, res, next) => {
  try {
    console.log("req reached at admin auth");

    // Assuming you have authentication middleware that sets req.user
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    next();
  } catch (error) {
    next(error);
  }
};