import express from 'express'
import rateLimit from 'express-rate-limit'
import { loginController, registerController } from '../controllers/authController.js'

// IP Limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after an hour'
})

// Creating Router object
const router = express.Router()

// routes
/**
 * @swagger
 * components:
 *  schemas:
 *      User:
 *         type: object
 *         required:
 *          - name
 *          - lastName
 *          - email
 *          - password
 *         properties:
 *          id:
 *             type: string
 *             description: The auto-generated id of the user collection
 *          name:
 *             type: string
 *             description: User Name
 *          lastName:
 *             type: string
 *             description: User Last Name
 *          email:
 *             type: string
 *             description: User Email
 *          password:
 *             type: string
 *             description: User Password should be greater than six characters
 *          location:
 *             type: string
 *             description: User Location
 *         example:
 *           id: 123456
 *           name: John
 *           lastName: Doe
 *           email: john@doe.com
 *           password: password
 *           location: Mumbai
 */

/**
 * 
 * @swagger
 * tags:
 *  name: Auth
 *  description: User Authentication API
 */

/**
 * @swagger
 * /api/v1/auth/register:
 *    post:
 *      summary: register new user
 *      tags: [Auth]
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *      responses:
 *        200:
 *          description: user created successfully
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 *        500:
 *          description: internal serevr error
 */




// REGISTER || POST
router.post('/register', limiter, registerController)

/**
 * @swagger
 * /api/v1/auth/login:
 *  post:
 *   summary: Login Page
 *   tags: [Auth]
 *   requestBody:
 *    required: true
 *    content:
 *      application/json:
 *        schema:
 *          $ref: '#/components/schemas/User'
 *   responses:
 *    200:
 *     description: User Logged In Successfully
 *     content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/User'
 *    500:
 *     description: Internal Server Error
 */

// LOGIN || POST
router.post('/login', limiter, loginController)

export default router