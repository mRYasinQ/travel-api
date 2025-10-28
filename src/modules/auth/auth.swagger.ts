/**
 * @swagger
 *
 * tags:
 *   - name: Authentication
 *     description: Authentication endpoints.
 *
 * components:
 *   schemas:
 *     Register:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: test@example.com
 *         password:
 *           type: string
 *           example: password
 *         otp:
 *           type: number
 *           example: 12345
 *       required:
 *         - email
 *         - password
 *         - otp
 *
 *     Recover:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: test@example.com
 *         password:
 *           type: string
 *           example: password
 *         otp:
 *           type: number
 *           example: 12345
 *       required:
 *         - email
 *         - password
 *         - otp
 *
 *     SendOtp:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: test@example.com
 *       required:
 *         - email
 *
 *     VerifyOtp:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: test@example.com
 *         otp:
 *           type: number
 *           example: 12345
 *       required:
 *         - email
 *         - otp
 *
 *     RegisterResponse:
 *       type: object
 *       properties:
 *         status_code:
 *           type: number
 *           example: 201
 *         data:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               format: email
 *               example: test@example.com
 *         message:
 *           type: string
 *           example: Registered successfully.
 *
 *     SendOtpResponse:
 *       type: object
 *       properties:
 *         status_code:
 *           type: number
 *           example: 200
 *         data:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               format: email
 *               example: test@example.com
 *         message:
 *           type: string
 *           example: Otp sent successfully.
 *
 *     RecoverResponse:
 *       type: object
 *       properties:
 *         status_code:
 *           type: number
 *           example: 200
 *         data:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               format: email
 *               example: test@example.com
 *         message:
 *           type: string
 *           example: Otp sent successfully.
 *
 *     VerifyOtpResponse:
 *       type: object
 *       properties:
 *         status_code:
 *           type: number
 *           example: 200
 *         data:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               format: email
 *               example: test@example.com
 *             is_verified:
 *               type: boolean
 *               example: true
 *         message:
 *           type: string
 *           example: Otp verified successfully.
 *
 * /auth/register:
 *   post:
 *     summary: Register a new user.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Register'
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/Register'
 *     responses:
 *       201:
 *         description: Created.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterResponse'
 *       400:
 *         description: Bad Request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: number
 *                   example: 400
 *                 error:
 *                   type: string
 *                   example: Invalid email.
 *
 * /auth/register/send-otp:
 *   post:
 *     summary: Send OTP to email.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SendOtp'
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/SendOtp'
 *     responses:
 *       200:
 *         description: Success.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SendOtpResponse'
 *       429:
 *         description: Too Many Requests.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: number
 *                   example: 429
 *                 error:
 *                   type: string
 *                   example: You must wait 60 seconds before requesting a new OTP.
 *       400:
 *         description: Bad Request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: number
 *                   example: 400
 *                 error:
 *                   type: string
 *                   example: Invalid email.
 *
 * /auth/register/verify-otp:
 *   post:
 *     summary: Verify OTP.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyOtp'
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/VerifyOtp'
 *     responses:
 *       200:
 *         description: Success.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VerifyOtpResponse'
 *       400:
 *         description: Bad Request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: number
 *                   example: 400
 *                 error:
 *                   type: string
 *                   example: Invalid Otp.
 *
 * /auth/recover:
 *   post:
 *     summary: Recover a user.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Recover'
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/Recover'
 *     responses:
 *       200:
 *         description: Success.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RecoverResponse'
 *       400:
 *         description: Bad Request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: number
 *                   example: 400
 *                 error:
 *                   type: string
 *                   example: Invalid email.
 *       404:
 *         description: Not Found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: number
 *                   example: 404
 *                 error:
 *                   type: string
 *                   example: User not found.
 *
 * /auth/recover/send-otp:
 *   post:
 *     summary: Send OTP to email.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SendOtp'
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/SendOtp'
 *     responses:
 *       200:
 *         description: Success.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SendOtpResponse'
 *       429:
 *         description: Too Many Requests.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: number
 *                   example: 429
 *                 error:
 *                   type: string
 *                   example: You must wait 60 seconds before requesting a new OTP.
 *       400:
 *         description: Bad Request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: number
 *                   example: 400
 *                 error:
 *                   type: string
 *                   example: Invalid email.
 *
 * /auth/recover/verify-otp:
 *   post:
 *     summary: Verify OTP.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyOtp'
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/VerifyOtp'
 *     responses:
 *       200:
 *         description: Success.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VerifyOtpResponse'
 *       400:
 *         description: Bad Request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: number
 *                   example: 400
 *                 error:
 *                   type: string
 *                   example: Invalid Otp.
 */
