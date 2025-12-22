import express from 'express';
import { createPaymentOrder, verifyPayment, getPaymentDetails } from '../controllers/paymentController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/create-order', authenticateToken, createPaymentOrder);
router.post('/verify', authenticateToken, verifyPayment);
router.get('/:appointmentId', authenticateToken, getPaymentDetails);

export default router;
