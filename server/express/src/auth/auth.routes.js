const express = require('express');
const {ensureAuthenticated} = require('./authMiddleware')
const { register, login, resetPassword, getMyInformation  } = require('./authController');

const router = express.Router();

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Login
 *     description: Allows the user to log in with their credentials and receive a token
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - identifier
 *               - password
 *             properties:
 *               identifier:
 *                 type: string
 *                 description: Username or email
 *                 example: bob@example.com
 *               password:
 *                 type: string
 *                 description: User password
 *                 example: 12345678
 *     responses:
 *       200:
 *         description: Successful login. Returns the token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Missing required fields or invalid format
 *       401:
 *         description: Incorrect credentials
 *       500:
 *         description: Undefined error
 */
router.post('/login', login);


/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Create a new user account
 *     description: Allows a user to register in the application by creating a new account.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: Username
 *                 example: TestUser
 *               email:
 *                 type: string
 *                 description: Unique email address
 *                 example: test@mail.com
 *               password:
 *                 type: string
 *                 description: Secure password (8 to 32 characters)
 *                 example: Secret123
 *     responses:
 *       201:
 *         description: Successful registration. Returns user data and token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Missing required fields or validation errors
 *       409:
 *         description: Email or Username already registered
 *       500:
 *         description: Undefined error
 */
router.post('/register', register);


/**
 * @openapi
 * /auth/password-reset:
 *   post:
 *     summary: Change password after reset request
 *     description: Allows the user to change their password using the reset token
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - resetToken
 *               - newPassword
 *             properties:
 *               resetToken:
 *                 type: string
 *                 description: Token received via email to validate the password change
 *                 example: "abc123-reset-token"
 *               newPassword:
 *                 type: string
 *                 description: New password (8 to 32 characters)
 *                 example: NewPassword123
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       401:
 *         description: Invalid or expired token
 *       400:
 *         description: Missing fields or password does not meet requirements
 *       409:
 *         description: New password cannot be the same as the previous one
 *       500:
 *         description: Undefined error
 */

router.post('/password-reset', resetPassword);


/**
 * @openapi
 * /auth/my-information:
 *   get:
 *     summary: Get user information via token
 *     security:
 *       - bearerAuth: []
 *     description: Allows a logged-in user to retrieve their information.
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: User details loaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: "TestName"
 *                 email:
 *                   type: string
 *                   example: "test@mail.com"
 *                 id:
 *                   type: string
 *                   example: "64ac9b7b5f8e2c001fc45abc"
 *       401:
 *         description: Authentication failed with the user's token
 *       500:
 *         description: Undefined error
 */
router.get('/my-information', ensureAuthenticated, getMyInformation);

module.exports = router;