import prisma from '../config/database.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateToken } from '../utils/jwt.js';

export const registerPatient = async (req, res) => {
  try {
    const { fullName, email, password, age, gender, city, state, phone } = req.body;

    // Validate input
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'Full name, email, and password are required' });
    }

    // Check if patient already exists
    const existingPatient = await prisma.patient.findUnique({ where: { email } });
    if (existingPatient) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    // Parse optional numeric fields safely for Prisma
    const parsedAge = age ? parseInt(age, 10) : null;
    if (Number.isNaN(parsedAge)) {
      return res.status(400).json({ message: 'Invalid age provided' });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create patient (include uploaded profile picture if present)
    const profilePath = req.file ? `/uploads/${req.file.filename}` : null;
    const patient = await prisma.patient.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        age: parsedAge,
        gender,
        city,
        state,
        phone,
        profilePicture: profilePath,
      },
    });

    // Generate token
    const token = generateToken({ id: patient.id, email: patient.email, role: 'patient' });

    res.status(201).json({
      message: 'Patient registered successfully',
      token,
      user: {
        id: patient.id,
        fullName: patient.fullName,
        email: patient.email,
        role: 'patient',
      },
    });
  } catch (error) {
    console.error('Register patient error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const registerPsychologist = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      phone,
      gender,
      clinicAddress,
      qualifications,
      licenseNumber,
      yearsExperience,
      consultationFee,
    } = req.body;

    // Validate input
    if (!fullName || !email || !password || !licenseNumber || !consultationFee) {
      return res.status(400).json({
        message: 'Full name, email, password, license number, and consultation fee are required',
      });
    }

    // Check if psychologist already exists
    const existingPsychologist = await prisma.psychologist.findFirst({
      where: {
        OR: [{ email }, { licenseNumber }],
      },
    });

    if (existingPsychologist) {
      return res.status(409).json({ message: 'Email or license number already registered' });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create psychologist (include uploaded profile picture if present)
    const profilePicPath = req.file ? `/uploads/${req.file.filename}` : null;
    const psychologist = await prisma.psychologist.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        phone,
        gender,
        clinicAddress,
        qualifications,
        licenseNumber,
        yearsExperience: yearsExperience ? parseInt(yearsExperience) : null,
        consultationFee: parseFloat(consultationFee),
        profilePicture: profilePicPath,
      },
    });

    // Generate token
    const token = generateToken({ id: psychologist.id, email: psychologist.email, role: 'psychologist' });

    res.status(201).json({
      message: 'Psychologist registered successfully',
      token,
      user: {
        id: psychologist.id,
        fullName: psychologist.fullName,
        email: psychologist.email,
        role: 'psychologist',
      },
    });
  } catch (error) {
    console.error('Register psychologist error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Email, password, and role are required' });
    }

    let user;

    if (role === 'patient') {
      user = await prisma.patient.findUnique({ where: { email } });
    } else if (role === 'psychologist') {
      user = await prisma.psychologist.findUnique({ where: { email } });
    } else if (role === 'admin') {
      user = await prisma.admin.findUnique({ where: { email } });
    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const passwordMatch = await comparePassword(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken({ id: user.id, email: user.email, role });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Request password reset (demo: responds success; email sending optional)
export const requestPasswordReset = async (req, res) => {
  try {
    const { email, role } = req.body;
    if (!email || !role) {
      return res.status(400).json({ message: 'Email and role are required' });
    }

    let user;
    if (role === 'patient') {
      user = await prisma.patient.findUnique({ where: { email } });
    } else if (role === 'psychologist') {
      user = await prisma.psychologist.findUnique({ where: { email } });
    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Always respond success to prevent user enumeration
    // Optionally: issue a short-lived token
    const token = generateToken({ email, role }, '15m');
    return res.status(200).json({
      message: 'If the account exists, password reset instructions have been sent',
      resetToken: token,
      demo: true,
    });
  } catch (error) {
    console.error('Request password reset error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Reset password (demo flow: verify role and email, then update password)
export const resetPassword = async (req, res) => {
  try {
    const { email, role, newPassword } = req.body;
    if (!email || !role || !newPassword) {
      return res.status(400).json({ message: 'Email, role and newPassword are required' });
    }

    const hashed = await hashPassword(newPassword);

    if (role === 'patient') {
      const existing = await prisma.patient.findUnique({ where: { email } });
      if (!existing) return res.status(404).json({ message: 'Account not found' });
      await prisma.patient.update({ where: { email }, data: { password: hashed } });
    } else if (role === 'psychologist') {
      const existing = await prisma.psychologist.findUnique({ where: { email } });
      if (!existing) return res.status(404).json({ message: 'Account not found' });
      await prisma.psychologist.update({ where: { email }, data: { password: hashed } });
    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
