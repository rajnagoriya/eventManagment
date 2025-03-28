import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/eventMan"; // Fetch env variable

    await mongoose.connect(mongoUri, );

    console.log("✅ DB connected successfully!");
  } catch (err) {
    console.error("❌ Error in DB connection:", err);
    process.exit(1); // Exit the app if DB connection fails
  }
};

export default connectDb;
