import express from 'express'
import { loginController, registerController } from '../controllers/authController.js'

// Creating Router object
const router = express.Router()

// routes
// REGISTER || POST
router.post('/register', registerController)

// LOGIN || POST
router.post('/login', loginController)

export default router