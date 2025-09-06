import mongoose from "mongoose";

// Define connection state type
type ConnectionObject = {
  isConnected?: number;
};
const connection: ConnectionObject = {};

async function connectDB(): Promise<void> {
  // Skip if already connected
  if (connection.isConnected) {
    console.log("Database is already connected");
    return;
  }

  try {
    // Connect to MongoDB
    const db = await mongoose.connect(`${process.env.MONGODB_URI}/suvash` || "");
    connection.isConnected = db.connection.readyState;
    console.log("Database connected");
  } catch (error) {
    // Exit if connection fails
    console.log("Error connecting to MongoDB : ", error);
    process.exit(1);
  }
}

export default connectDB;
