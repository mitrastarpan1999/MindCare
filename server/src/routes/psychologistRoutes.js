import express from 'express';
import {
  getAllPsychologists,
  getPsychologistById,
  updatePsychologistProfile,
  uploadLicenseDocument,
  setAvailability,
  getMyBookings,
  updateBookingStatus,
} from '../controllers/psychologistController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';
import { uploadLicense } from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getAllPsychologists);
router.get('/:id', getPsychologistById);

// Protected routes
router.put('/:id', authenticateToken, authorizeRole(['psychologist']), updatePsychologistProfile);
router.post('/:id/upload-license', authenticateToken, authorizeRole(['psychologist']), uploadLicense, uploadLicenseDocument);
router.post('/:id/availability', authenticateToken, authorizeRole(['psychologist']), setAvailability);
router.get('/:id/bookings', authenticateToken, authorizeRole(['psychologist']), getMyBookings);
router.put('/:id/bookings/:appointmentId/status', authenticateToken, authorizeRole(['psychologist']), updateBookingStatus);

export default router;
