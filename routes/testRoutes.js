import express from 'express';
import { testPostController } from '../controllers/testController.js';
import userAuth from '../middlewares/authMiddleware.js';

// Creating Router Object which provides Routing functionality
const router = express.Router();

// Routes
router.post('/test-post', userAuth, testPostController);

export default router;