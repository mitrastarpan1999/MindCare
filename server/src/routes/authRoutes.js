import express from 'express';
import { registerPatient, registerPsychologist, login, requestPasswordReset, resetPassword } from '../controllers/authController.js';
import { upload } from '../utils/multerConfig.js';

const router = express.Router();

// Allow optional profilePicture upload during registration
router.post('/register-patient', upload.single('profilePicture'), registerPatient);
router.post('/register-psychologist', upload.single('profilePicture'), registerPsychologist);
router.post('/login', login);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);

export default router;
