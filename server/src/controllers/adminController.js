import prisma from '../config/database.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';
import { hashPassword } from '../utils/password.js';

export const listPatients = async (req, res) => {
  try {
    const patients = await prisma.patient.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        fullName: true,
        email: true,
        age: true,
        gender: true,
        city: true,
        state: true,
        phone: true,
        profilePicture: true,
        createdAt: true,
      },
    });
    res.status(200).json(patients);
  } catch (error) {
    console.error('Admin listPatients error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const listPsychologists = async (req, res) => {
  try {
    const psychologists = await prisma.psychologist.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        specialization: true,
        clinicAddress: true,
        qualifications: true,
        licenseNumber: true,
        profilePicture: true,
        yearsExperience: true,
        consultationFee: true,
        createdAt: true,
      },
    });
    res.status(200).json(psychologists);
  } catch (error) {
    console.error('Admin listPsychologists error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deletePatient = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.patient.delete({ where: { id } });
    res.status(200).json({ message: 'Patient deleted' });
  } catch (error) {
    console.error('Admin deletePatient error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deletePsychologist = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.psychologist.delete({ where: { id } });
    res.status(200).json({ message: 'Psychologist deleted' });
  } catch (error) {
    console.error('Admin deletePsychologist error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createPatient = async (req, res) => {
  try {
    const { fullName, email, password, age, gender, city, state, phone } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'Full name, email, and password are required' });
    }

    const exists = await prisma.patient.findUnique({ where: { email } });
    if (exists) return res.status(409).json({ message: 'Email already registered' });

    const hashed = await hashPassword(password);
    const patient = await prisma.patient.create({
      data: {
        fullName,
        email,
        password: hashed,
        age: age ? parseInt(age, 10) : null,
        gender,
        city,
        state,
        phone,
      },
    });
    res.status(201).json(patient);
  } catch (error) {
    console.error('Admin createPatient error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createPsychologist = async (req, res) => {
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
      specialization,
    } = req.body;

    if (!fullName || !email || !password || !licenseNumber || !consultationFee) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const existing = await prisma.psychologist.findFirst({
      where: { OR: [{ email }, { licenseNumber }] },
    });
    if (existing) return res.status(409).json({ message: 'Email or license already registered' });

    const hashed = await hashPassword(password);
    const psychologist = await prisma.psychologist.create({
      data: {
        fullName,
        email,
        password: hashed,
        phone,
        gender,
        clinicAddress,
        qualifications,
        licenseNumber,
        yearsExperience: yearsExperience ? parseInt(yearsExperience) : null,
        consultationFee: parseFloat(consultationFee),
        specialization,
      },
    });
    res.status(201).json(psychologist);
  } catch (error) {
    console.error('Admin createPsychologist error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getSettings = async (req, res) => {
  try {
    const settings = await prisma.setting.findMany();
    const map = settings.reduce((acc, s) => {
      acc[s.key] = s.value;
      return acc;
    }, {});
    res.status(200).json(map);
  } catch (error) {
    console.error('Admin getSettings error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const entries = Object.entries(req.body || {});
    const results = [];
    for (const [key, value] of entries) {
      const upserted = await prisma.setting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      });
      results.push(upserted);
    }
    res.status(200).json({ message: 'Settings updated', count: results.length });
  } catch (error) {
    console.error('Admin updateSettings error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email, password, age, gender, city, state, phone } = req.body;

    if (!id) return res.status(400).json({ message: 'Patient ID is required' });
    if (!fullName || !email) return res.status(400).json({ message: 'Name and email are required' });

    const patient = await prisma.patient.findUnique({ where: { id } });
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    // Check if email is being changed and if it's already in use
    if (email !== patient.email) {
      const exists = await prisma.patient.findUnique({ where: { email } });
      if (exists) return res.status(409).json({ message: 'Email already in use' });
    }

    const updateData = {
      fullName,
      email,
      age: age ? parseInt(age, 10) : null,
      gender,
      city,
      state,
      phone,
    };

    if (password) {
      updateData.password = await hashPassword(password);
    }

    const updated = await prisma.patient.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json({ message: 'Patient updated', patient: updated });
  } catch (error) {
    console.error('Admin updatePatient error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updatePsychologist = async (req, res) => {
  try {
    const { id } = req.params;
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
      specialization,
    } = req.body;

    if (!id) return res.status(400).json({ message: 'Psychologist ID is required' });
    if (!fullName || !email || !licenseNumber || !consultationFee) {
      return res.status(400).json({ message: 'Name, email, license, and fee are required' });
    }

    const psychologist = await prisma.psychologist.findUnique({ where: { id } });
    if (!psychologist) return res.status(404).json({ message: 'Psychologist not found' });

    // Check if email is being changed and if it's already in use
    if (email !== psychologist.email) {
      const exists = await prisma.psychologist.findUnique({ where: { email } });
      if (exists) return res.status(409).json({ message: 'Email already in use' });
    }

    // Check if license is being changed and if it's already in use
    if (licenseNumber !== psychologist.licenseNumber) {
      const existsLicense = await prisma.psychologist.findUnique({ where: { licenseNumber } });
      if (existsLicense) return res.status(409).json({ message: 'License already in use' });
    }

    const updateData = {
      fullName,
      email,
      phone,
      gender,
      clinicAddress,
      qualifications,
      licenseNumber,
      yearsExperience: yearsExperience ? parseInt(yearsExperience) : null,
      consultationFee: parseFloat(consultationFee),
      specialization,
    };

    if (password) {
      updateData.password = await hashPassword(password);
    }

    const updated = await prisma.psychologist.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json({ message: 'Psychologist updated', psychologist: updated });
  } catch (error) {
    console.error('Admin updatePsychologist error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const uploadPatientProfilePicture = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const patient = await prisma.patient.findUnique({ where: { id } });
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    const profilePicture = `/uploads/${req.file.filename}`;
    const updated = await prisma.patient.update({
      where: { id },
      data: { profilePicture },
    });

    res.status(200).json({ message: 'Profile picture updated', patient: updated });
  } catch (error) {
    console.error('Admin uploadPatientProfilePicture error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const uploadPsychologistProfilePicture = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const psychologist = await prisma.psychologist.findUnique({ where: { id } });
    if (!psychologist) return res.status(404).json({ message: 'Psychologist not found' });

    const profilePicture = `/uploads/${req.file.filename}`;
    const updated = await prisma.psychologist.update({
      where: { id },
      data: { profilePicture },
    });

    res.status(200).json({ message: 'Profile picture updated', psychologist: updated });
  } catch (error) {
    console.error('Admin uploadPsychologistProfilePicture error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
