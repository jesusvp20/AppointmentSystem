import express from "express";
import { getBarbers, createBarber } from "../controllers/barberController.js";


const router = express.Router();

/**
 * @swagger
 * /api/barbers:
 *   post:
 *     summary: Add a new barber
 *     tags: [Barbers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Barber created
 *       400:
 *         description: Name is required
 */
router.post('/', createBarber);

/**
 * @swagger
 * /api/barbers:
 *   get:
 *     summary: Get a paginated list of active barbers
 *     tags: [Barbers]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Paginated list of active barbers
 */
router.get('/', getBarbers);

export default router;