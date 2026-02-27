import express from 'express'
import { createAppointment, getAppointments, cancelAppointment } from '../controllers/appointmentController.js'

const router = express.Router();

/**
 * @swagger
 * /api/appointments:
 *   post:
 *     summary: Create a new appointment
 *     tags: [Appointments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerName
 *               - customerPhone
 *               - barberId
 *               - start
 *               - durationMin
 *             properties:
 *               customerName:
 *                 type: string
 *               customerPhone:
 *                 type: string
 *               barberId:
 *                 type: string
 *               start:
 *                 type: string
 *                 example: "2026-03-01 10:00"
 *                 description: "Format: YYYY-MM-DD HH:mm"
 *               durationMin:
 *                 type: number
 *                 enum: [30, 45, 60]
 *     responses:
 *       201:
 *         description: Appointment created successfully
 *       400:
 *         description: Bad request (Invalid data or duration)
 *       404:
 *         description: Barber not found
 *       409:
 *         description: Conflict (Double booking or Overlap)
 */
router.post('/', createAppointment);

/**
 * @swagger
 * /api/appointments:
 *   get:
 *     summary: Get a paginated list of scheduled appointments
 *     tags: [Appointments]
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
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by precise date mapping (YYYY-MM-DD)
 *       - in: query
 *         name: barberId
 *         schema:
 *           type: string
 *         description: Filter by Barber ID
 *     responses:
 *       200:
 *         description: List of scheduled appointments
 */
router.get('/', getAppointments);

/**
 * @swagger
 * /api/appointments/{id}/cancel:
 *   put:
 *     summary: Cancel an appointment
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Appointment ID
 *     responses:
 *       200:
 *         description: Appointment cancelled successfully
 *       404:
 *         description: Appointment not found
 */
router.put('/:id/cancel', cancelAppointment);

export default router;