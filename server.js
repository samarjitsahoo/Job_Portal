// To run -> node server.js
// To run using nodemon -> npm run server / nodemon server.js
// const express = require ('express'); // CpmmomJS
// API Documentation
import swaggerUi from 'swagger-ui-express';
import swaggerDoc from 'swagger-jsdoc';
// Packeages Import
import express from 'express'; // ES6 (Module JS)
import 'express-async-errors';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
// Security Packages
import helmet from 'helmet';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
// File Import
import connectDB from './config/db.js';
// Routes Import
import testRoutes from './routes/testRoutes.js';
import authRoutes from './routes/authRoutes.js';
import errorMiddleware from './middlewares/errorMiddlesware.js';
import jobsRoutes from './routes/jobsRoute.js';
import userRoutes from './routes/userRoutes.js';

// Configuring Dot Env
dotenv.config();

// MongoDB Connection
connectDB();

// Swagger API Config
// Swagger API Options
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Job Portal API',
            version: '1.0.0',
            description: 'Node Express JS Job Portal Application',
        },
        servers: [
            {
                url: 'https://job-portal-eeb9.onrender.com/',
            },
        ],
    },
    apis: ['./routes/*.js'],
};

const spec = swaggerDoc(options);


//REST object
const app = express();

// Middlewares
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Route
// app.get('/', (req, res) => {
//     res.send('Welcome to my Job Portal');
// });

app.use('/api/v1/test', testRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/job', jobsRoutes);

// HomeRoute
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(spec));

// Validation Middleware
app.use(errorMiddleware);

// Port
const PORT = process.env.PORT || 8080;

// Listen
app.listen(PORT, () => {
    console.log(`Node Server is running in ${process.env.DEV_MODE} Mode on port no ${PORT}`);
});