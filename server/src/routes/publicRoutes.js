import express from 'express';
import { getSettings } from '../controllers/adminController.js';

const router = express.Router();

// Public endpoint to fetch site settings (no auth required)
router.get('/settings', getSettings);

export default router;
