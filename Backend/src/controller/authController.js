import {User} from "../model/UserSchema.model.js"
import bcrypt from "bcrypt";
import z from "zod"
import { generateToken } from "../utils/generateToken.js";
import { loginSchema, signupSchema } from "../validations/userValidation.js";

// Signup controller
export const signup = async (req, res) => {
  try {
    // Validate request body
    const validatedData = signupSchema.parse(req.body);
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: validatedData.email });
    console.log("email is "+JSON.stringify(existingUser));
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(validatedData.password, salt);

    // Create new user
    const newUser = new User({
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      email: validatedData.email,
      passwordHash: hashedPassword,
      role: validatedData.role,
      collegeId: validatedData.collegeId,
      department: validatedData.department,
      phoneNumber: validatedData.phoneNumber
    });

    await newUser.save();

    // Generate token
    const token = generateToken(newUser._id, newUser.role);

    // Return response without password hash
    const userResponse = {
      _id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      role: newUser.role,
      collegeId: newUser.collegeId,
      department: newUser.department,
      phoneNumber: newUser.phoneNumber,
      createdAt: newUser.createdAt
    };

    res.status(201).json({
      message: "User created successfully",
      user: userResponse,
      token
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.errors
      });
    }
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Login controller
export const login = async (req, res) => {
  try {

    // Validate request body
    const validatedData = loginSchema.parse(req.body);

    // Find user by email
    const user = await User.findOne({ email: validatedData.email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(
      validatedData.password,
      user.passwordHash
    );

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = generateToken(user._id, user.role);

    // Return response without password hash
    const userResponse = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      collegeId: user.collegeId,
      department: user.department,
      phoneNumber: user.phoneNumber,
      lastLogin: user.lastLogin
    };

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      message: "Login successful",
      user: userResponse,
      token
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.errors
      });
    }
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};