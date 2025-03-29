import express from "express";
// import dotenv from "dotenv";
import cors from "cors";
import connectDb from "./src/db/connectDb.js";
import path from "path";
import dotenv from 'dotenv';
dotenv.config();
const app = express();

// dotenv.config({
//     path: './.env.sample'
// });

connectDb();

//middlewares 
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, "*"); // Allow requests with no Origin (like mobile apps, Postman)
    }
    return callback(null, origin); // Allow all origins dynamically
  },
  credentials: true // Allow cookies, sessions, and authentication
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use('/uploads', express.static('uploads'));


// routes 
import userRoute from "./src/routes/user.route.js"
import eventRoute from "./src/routes/event.route.js"
import registrationRoute from "./src/routes/registration.route.js"
import feedbackRoute from "./src/routes/feedback.route.js"
import reminderRoute from "./src/routes/reminder.route.js"

app.use("/api/v1/user",userRoute);
app.use("/api/v1/events",eventRoute);
app.use("/api/v1/registration",registrationRoute);
app.use("/api/v1/feedback",feedbackRoute);
app.use("/api/v1/reminder",reminderRoute);

app.use("/",(req,res) =>{
  res.send("clg event management !!");
})

// Global Error Handler
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something went wrong';
    if (err.name === "CastError") err.message = "Invalid ID";
    console.log("error is :- "+ err);
    res.status(statusCode).json({
      success: false,
      message: err.message,
    });
  });


app.listen(process.env.PORT,()=>{
    console.log(`server is running on port ${process.env.PORT}`);
})