import mongoose from "mongoose";

// Define connection state type
type ConnectionObject = {
  isConnected?: number;
};
const connection: ConnectionObject = {};

async function connectDB(): Promise<void> {
  // Skip if already connected
  if (connection.isConnected) {
    return;
  }

  try {
    // Connect to MongoDB
    const db = await mongoose.connect(
      `${process.env.MONGODB_URI}/suvash` || ""
    );
    connection.isConnected = db.connection.readyState;
  } catch (error) {
    console.error({ error });
    // Exit if connection fails
    process.exit(1);
  }
}

export default connectDB;
