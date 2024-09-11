const express = require("express");

const {signup, login, logout, forgetPassword, resetPassword, updatePassword} = require("../controller/userController");
const isAuthenticated = require("../middleware/isAuthenticated");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - confirmPassword
 *       properties:
 *         name:
 *           type: string
 *           description: User's username
 *           example: JohnDoe
 *         email:
 *           type: string
 *           description: User's email
 *           example: john.doe@example.com
 *         password:
 *           type: string
 *           description: User's password
 *           example: strongpassword123
 *         confirmPassword:
 *           type: string
 *           description: User's confirm password
 *           example: strongpassword123
 */

/**
 * @swagger
 * /api/v1/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: User already exists or validation errors
 *       500:
 *         description: Server error
 */



router.post("/signup", signup);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 description: User's password
 *                 example: strongpassword123
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Invalid email or password
 *       500:
 *         description: Server error
 */


router.post("/login", login);
router.get("/logout", logout);
router.post("/forgotpassword", forgetPassword)
router.put("/resetpassword/:resetToken", resetPassword);
router.put("/updatepassword",isAuthenticated, updatePassword);

module.exports = router;