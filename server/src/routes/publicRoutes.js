import express from 'express';
import { getSettings } from '../controllers/adminController.js';
import { validateContact, sendContactMessage } from '../controllers/contactController.js';

const router = express.Router();

// Public endpoint to fetch site settings (no auth required)
router.get('/settings', getSettings);

// Contact form endpoint
router.post('/contact', validateContact, sendContactMessage);

export default router;
