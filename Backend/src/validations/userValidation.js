import { z } from "zod";

// Signup validation schema
export const signupSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters"),
  role: z.enum(['student', 'admin']),
  collegeId: z.string().optional(),
  department: z.string().optional(),
  phoneNumber: z.string().optional()
});

// Login validation schema
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required")
});

export default { signupSchema,loginSchema};
