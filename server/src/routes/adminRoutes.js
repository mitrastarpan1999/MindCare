import express from 'express';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import {
  listPatients,
  listPsychologists,
  deletePatient,
  deletePsychologist,
  createPatient,
  createPsychologist,
  getSettings,
  updateSettings,
  updatePatient,
  updatePsychologist,
  uploadPatientProfilePicture,
  uploadPsychologistProfilePicture,
} from '../controllers/adminController.js';

const router = express.Router();

// All admin routes require admin role
router.use(authenticateToken, authorizeRole(['admin']));

// Users management
router.get('/patients', listPatients);
router.post('/patients', createPatient);
router.put('/patients/:id', updatePatient);
router.post('/patients/:id/upload-picture', upload.single('profilePicture'), uploadPatientProfilePicture);
router.delete('/patients/:id', deletePatient);

router.get('/psychologists', listPsychologists);
router.post('/psychologists', createPsychologist);
router.put('/psychologists/:id', updatePsychologist);
router.post('/psychologists/:id/upload-picture', upload.single('profilePicture'), uploadPsychologistProfilePicture);
router.delete('/psychologists/:id', deletePsychologist);

// Site settings
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

export default router;
