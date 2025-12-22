import express from 'express';
import {
  createAppointment,
  getPatientAppointments,
  getPsychologistAppointments,
  updateAppointmentStatus,
  cancelAppointment,
} from '../controllers/appointmentController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, createAppointment);
router.get('/patient/:id', authenticateToken, getPatientAppointments);
router.get('/psychologist/:id', authenticateToken, getPsychologistAppointments);
router.put('/:id/status', authenticateToken, updateAppointmentStatus);
router.put('/:id/cancel', authenticateToken, cancelAppointment);

export default router;
