/**
 * @swagger
 *
 * tags:
 *   - name: Session
 *     description: Session endpoints.
 *
 * components:
 *   schemas:
 *     Session:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           example: 1
 *         browser:
 *           type: string
 *           example: Firefox
 *         os:
 *           type: string
 *           example: Linux
 *         created_at:
 *           type: string
 *           example: 2021-01-01T00:00:00.000Z
 *         expire_at:
 *           type: string
 *           example: 2021-01-01T00:00:00.000Z
 *         is_active:
 *           type: boolean
 *           example: false
 *
 *     SessionsResponse:
 *       type: object
 *       properties:
 *         status_code:
 *           type: number
 *           example: 200
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Session'
 *         message:
 *           type: string
 *           example: Sessions retrieved successfully.
 *
 *     SessionResponse:
 *       type: object
 *       properties:
 *         status_code:
 *           type: number
 *           example: 200
 *         data:
 *             $ref: '#/components/schemas/Session'
 *         message:
 *           type: string
 *           example: Session retrieved successfully.
 *
 *     DeleteSessionResponse:
 *       type: object
 *       properties:
 *         status_code:
 *           type: number
 *           example: 200
 *         message:
 *           type: string
 *           example: Session deleted successfully.
 *
 *     ClearSessionResponse:
 *       type: object
 *       properties:
 *         status_code:
 *           type: number
 *           example: 200
 *         message:
 *           type: string
 *           example: All sessions cleared successfully.
 *
 * /session:
 *   get:
 *     summary: Get all sessions.
 *     tags: [Session]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SessionsResponse'
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
 *                   example: Invalid request.
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: number
 *                   example: 401
 *                 error:
 *                   type: string
 *                   example: Access denied. Authentication is required.
 *
 * /session/{id}:
 *   get:
 *     summary: Get a session by id.
 *     tags: [Session]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The id of the session.
 *         schema:
 *           type: number
 *           example: 1
 *     responses:
 *       200:
 *         description: Success.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SessionResponse'
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
 *                   example: Invalid request.
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: number
 *                   example: 401
 *                 error:
 *                   type: string
 *                   example: Access denied. Authentication is required.
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
 *                   example: Session not found.
 *
 *   delete:
 *     summary: Delete a session by id.
 *     tags: [Session]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The id of the session.
 *         schema:
 *           type: number
 *           example: 1
 *     responses:
 *       200:
 *         description: Success.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteSessionResponse'
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
 *                   example: Invalid request.
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: number
 *                   example: 401
 *                 error:
 *                   type: string
 *                   example: Access denied. Authentication is required.
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
 *                   example: Session not found.
 *       409:
 *         description: Conflict.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: number
 *                   example: 409
 *                 error:
 *                   type: string
 *                   example: Cannot delete active session.
 *
 * /session/clear:
 *   delete:
 *     summary: Clear all sessions.
 *     tags: [Session]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ClearSessionResponse'
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
 *                   example: Invalid request.
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: number
 *                   example: 401
 *                 error:
 *                   type: string
 *                   example: Access denied. Authentication is required.
 */
