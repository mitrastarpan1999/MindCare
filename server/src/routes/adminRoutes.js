import express from 'express';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';
import {
  listPatients,
  listPsychologists,
  deletePatient,
  deletePsychologist,
  createPatient,
  createPsychologist,
  getSettings,
  updateSettings,
} from '../controllers/adminController.js';

const router = express.Router();

// All admin routes require admin role
router.use(authenticateToken, authorizeRole(['admin']));

// Users management
router.get('/patients', listPatients);
router.post('/patients', createPatient);
router.delete('/patients/:id', deletePatient);

router.get('/psychologists', listPsychologists);
router.post('/psychologists', createPsychologist);
router.delete('/psychologists/:id', deletePsychologist);

// Site settings
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

export default router;
