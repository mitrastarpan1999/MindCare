import prisma from '../config/database.js';
import Razorpay from 'razorpay';
import { config } from '../config/env.js';
import crypto from 'crypto';

const razorpay = new Razorpay({
  key_id: config.RAZORPAY_KEY_ID,
  key_secret: config.RAZORPAY_KEY_SECRET,
});

export const createPaymentOrder = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const patientId = req.user.id;

    if (!appointmentId) {
      return res.status(400).json({ message: 'Appointment ID is required' });
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        psychologist: true,
        payment: true,
      },
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.patientId !== patientId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Check if payment already exists
    if (appointment.payment) {
      return res.status(409).json({ message: 'Payment already created for this appointment' });
    }

    // Validate fee before sending to Razorpay
    const fee = Number(appointment.psychologist.consultationFee);
    if (!Number.isFinite(fee) || fee <= 0) {
      return res.status(400).json({ message: 'Invalid consultation fee for this appointment' });
    }

    // Short-circuit when payments are disabled (local/dev without Razorpay keys)
    if (!config.PAYMENTS_ENABLED) {
      const mockOrder = {
        id: `order_mock_${appointmentId}`,
        amount: Math.round(fee * 100),
        currency: 'INR',
      };

      const payment = await prisma.payment.create({
        data: {
          appointmentId,
          patientId,
          psychologistId: appointment.psychologistId,
          amount: fee,
          currency: 'INR',
          orderId: mockOrder.id,
          status: 'pending',
        },
      });

      return res.status(201).json({
        message: 'Payment order created in mock mode',
        data: {
          payment,
          razorpayOrder: mockOrder,
          razorpayKey: 'mock_key',
        },
      });
    }

    // Validate payment provider configuration
    if (!config.RAZORPAY_KEY_ID || !config.RAZORPAY_KEY_SECRET) {
      return res.status(503).json({ message: 'Payment provider is not configured' });
    }

    // Create Razorpay order
    const amount = Math.round(fee * 100); // Convert to paise

    const razorpayOrder = await razorpay.orders.create({
      amount: amount,
      currency: 'INR',
      receipt: `appointment_${appointmentId}`,
      notes: {
        appointmentId: appointmentId,
        patientId: patientId,
        psychologistId: appointment.psychologistId,
      },
    });

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        appointmentId,
        patientId,
        psychologistId: appointment.psychologistId,
        amount: appointment.psychologist.consultationFee,
        currency: 'INR',
        orderId: razorpayOrder.id,
        status: 'pending',
      },
    });

    res.status(201).json({
      message: 'Payment order created successfully',
      data: {
        payment,
        razorpayOrder: {
          id: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
        },
        razorpayKey: config.RAZORPAY_KEY_ID,
      },
    });
  } catch (error) {
    // Surface Razorpay errors to aid debugging while keeping status meaningful
    const status = error?.statusCode === 400 ? 400 : 500;
    const providerMessage = error?.error?.description || error?.message;
    console.error('Create payment order error:', providerMessage || error);
    res.status(status).json({
      message: providerMessage || 'Server error',
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;
    const patientId = req.user.id;

    if (!orderId || !paymentId || !signature) {
      return res.status(400).json({ message: 'Payment details are required' });
    }

    // Verify signature
    const body = orderId + '|' + paymentId;
    const expectedSignature = crypto
      .createHmac('sha256', config.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== signature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    // Update payment record
    const payment = await prisma.payment.findFirst({
      where: { orderId },
    });

    if (!payment) {
      return res.status(404).json({ message: 'Payment record not found' });
    }

    if (payment.patientId !== patientId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const updatedPayment = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        paymentId,
        signature,
        status: 'completed',
      },
      include: {
        appointment: true,
      },
    });

    // Update appointment status to approved
    await prisma.appointment.update({
      where: { id: payment.appointmentId },
      data: { status: 'approved' },
    });

    res.status(200).json({
      message: 'Payment verified successfully',
      data: updatedPayment,
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getPaymentDetails = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const payment = await prisma.payment.findFirst({
      where: { appointmentId },
      include: {
        appointment: true,
        patient: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        psychologist: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.status(200).json({
      message: 'Payment details retrieved successfully',
      data: payment,
    });
  } catch (error) {
    console.error('Get payment details error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
