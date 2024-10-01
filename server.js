// To run -> node server.js
// To run using nodemon -> npm run server / nodemon server.js
// const express = require ('express'); // CpmmomJS
// Packeages Import
import express from 'express'; // ES6 (Module JS)
import 'express-async-errors';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
// File Import
import connectDB from './config/db.js';
// Routes Import
import testRoutes from './routes/testRoutes.js';
import authRoutes from './routes/authRoutes.js';
import errorMiddleware from './middlewares/errorMiddlesware.js';

// Configuring Dot Env
dotenv.config();

// MongoDB Connection
connectDB();

//REST object
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Route
// app.get('/', (req, res) => {
//     res.send('Welcome to my Job Portal');
// });

app.use('/api/v1/test', testRoutes);
app.use('/api/v1/auth', authRoutes);

// Validation Middleware
app.use(errorMiddleware);

// Port
const PORT = process.env.PORT || 8080;

// Listen
app.listen(PORT, () => {
    console.log(`Node Server is running in ${process.env.DEV_MODE} Mode on port no ${PORT}`);
});