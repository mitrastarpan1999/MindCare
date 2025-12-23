import nodemailer from 'nodemailer';
import { body, validationResult } from 'express-validator';
import { config } from '../config/env.js';

export const validateContact = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('Valid email is required'),
  body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
];

function buildTransport() {
  // Prefer explicit SMTP settings; fallback to Gmail service if user provided creds
  if (config.SMTP_HOST && config.SMTP_PORT && config.SMTP_USER && config.SMTP_PASSWORD) {
    return nodemailer.createTransport({
      host: config.SMTP_HOST,
      port: Number(config.SMTP_PORT),
      secure: Number(config.SMTP_PORT) === 465,
      auth: { user: config.SMTP_USER, pass: config.SMTP_PASSWORD },
    });
  }

  if (config.SMTP_USER && config.SMTP_PASSWORD) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: { user: config.SMTP_USER, pass: config.SMTP_PASSWORD },
    });
  }

  return null;
}

export const sendContactMessage = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Invalid input', errors: errors.array() });
  }

  const { name, email, message } = req.body;
  const transport = buildTransport();

  if (!transport) {
    return res.status(500).json({
      message: 'Email service not configured',
      hint: 'Set SMTP_USER and SMTP_PASSWORD (Gmail app password) or full SMTP settings in your .env',
    });
  }

  const toAddress = config.CONTACT_EMAIL || 'mitrastarpan1999@gmail.com';
  const fromAddress = config.SENDER_EMAIL || config.SMTP_USER || 'no-reply@mindcare.local';

  try {
    const info = await transport.sendMail({
      from: `MindCare Contact <${fromAddress}>`,
      to: toAddress,
      replyTo: email,
      subject: `New contact from ${name}`,
      text: message,
      html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong></p>
             <p>${message.replace(/\n/g, '<br/>')}</p>`,
    });

    res.status(200).json({ message: 'Message sent successfully', id: info.messageId });
  } catch (err) {
    console.error('Contact send error:', err);
    res.status(500).json({ message: 'Failed to send email', error: err.message });
  }
};
