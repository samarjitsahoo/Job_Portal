import express from 'express';
import { testPostController } from '../controllers/testController.js';

// Creating Router Object which provides Routing functionality
const router = express.Router();

// Routes
router.post('/test-post', testPostController);

export default router;