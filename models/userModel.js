import mongoose from "mongoose";
import validator from "validator";
import bcrypt from 'bcryptjs';

// Creating schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: [true, 'Name is required'],
        unique: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password length should be greater than six characters']
    },
    location: {
        type: String,
        default: 'India'
    },

}, { timestamp: true });

//Middleware
userSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

export default mongoose.model('User', userSchema);