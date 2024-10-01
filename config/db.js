import mongoose, { mongo } from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL)
        console.log(`MongoDB Connected: ${mongoose.connection.host}`);
    } catch (error) {
        console.log(`MongoDB Connection Error: ${error}`);
    }
}

export default connectDB;