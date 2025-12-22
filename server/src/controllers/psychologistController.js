import prisma from '../config/database.js';
import path from 'path';

export const getAllPsychologists = async (req, res) => {
  try {
    const { city, minFee, maxFee } = req.query;

    let whereClause = {};

    if (city) {
      whereClause.clinicAddress = { contains: city, mode: 'insensitive' };
    }

    if (minFee || maxFee) {
      whereClause.consultationFee = {};
      if (minFee) whereClause.consultationFee.gte = parseFloat(minFee);
      if (maxFee) whereClause.consultationFee.lte = parseFloat(maxFee);
    }

    const psychologists = await prisma.psychologist.findMany({
      where: whereClause,
      select: {
        id: true,
        fullName: true,
        qualifications: true,
        profilePicture: true,
        clinicAddress: true,
        yearsExperience: true,
        consultationFee: true,
        availabilities: true,
      },
    });

    res.status(200).json({
      message: 'Psychologists retrieved successfully',
      data: psychologists,
    });
  } catch (error) {
    console.error('Get psychologists error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getPsychologistById = async (req, res) => {
  try {
    const { id } = req.params;

    const psychologist = await prisma.psychologist.findUnique({
      where: { id },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        profilePicture: true,
        gender: true,
        qualifications: true,
        licenseNumber: true,
        specialization: true,
        about: true,
        yearsExperience: true,
        consultationFee: true,
        clinicAddress: true,
        availabilities: true,
      },
    });

    if (!psychologist) {
      return res.status(404).json({ message: 'Psychologist not found' });
    }

    res.status(200).json({
      message: 'Psychologist retrieved successfully',
      data: psychologist,
    });
  } catch (error) {
    console.error('Get psychologist by ID error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updatePsychologistProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { phone, gender, clinicAddress, qualifications, yearsExperience, consultationFee } = req.body;

    // Verify ownership
    if (req.user.id !== id) {
      return res.status(403).json({ message: 'Unauthorized to update this profile' });
    }

    const updatedData = {};
    if (phone) updatedData.phone = phone;
    if (gender) updatedData.gender = gender;
    if (clinicAddress) updatedData.clinicAddress = clinicAddress;
    if (qualifications) updatedData.qualifications = qualifications;
    if (yearsExperience) updatedData.yearsExperience = parseInt(yearsExperience);
    if (consultationFee) updatedData.consultationFee = parseFloat(consultationFee);

    const updatedPsychologist = await prisma.psychologist.update({
      where: { id },
      data: updatedData,
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        gender: true,
        qualifications: true,
        yearsExperience: true,
        consultationFee: true,
        clinicAddress: true,
      },
    });

    res.status(200).json({
      message: 'Profile updated successfully',
      data: updatedPsychologist,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const uploadLicenseDocument = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Verify ownership
    if (req.user.id !== id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const licenseDocUrl = `/uploads/${req.file.filename}`;

    const updatedPsychologist = await prisma.psychologist.update({
      where: { id },
      data: { licenseDocUrl },
      select: {
        id: true,
        fullName: true,
        licenseDocUrl: true,
      },
    });

    res.status(200).json({
      message: 'License document uploaded successfully',
      data: updatedPsychologist,
    });
  } catch (error) {
    console.error('Upload license error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const setAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { dayOfWeek, startTime, endTime, slotDurationMins } = req.body;

    // Verify ownership
    if (req.user.id !== id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (!dayOfWeek || !startTime || !endTime) {
      return res.status(400).json({ message: 'Day, start time, and end time are required' });
    }

    const availability = await prisma.availability.create({
      data: {
        psychologistId: id,
        dayOfWeek,
        startTime,
        endTime,
        slotDurationMins: slotDurationMins || 30,
      },
    });

    res.status(201).json({
      message: 'Availability set successfully',
      data: availability,
    });
  } catch (error) {
    console.error('Set availability error:', error);
    if (error.code === 'P2002') {
      return res.status(409).json({ message: 'This time slot already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.id !== id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const bookings = await prisma.appointment.findMany({
      where: { psychologistId: id },
      include: {
        patient: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
          },
        },
        payment: true,
      },
      orderBy: { appointmentDate: 'asc' },
    });

    res.status(200).json({
      message: 'Bookings retrieved successfully',
      data: bookings,
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { id, appointmentId } = req.params;
    const { status, note } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment || appointment.psychologistId !== id) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (req.user.id !== id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status, statusNote: note || null },
      include: {
        patient: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        payment: true,
      },
    });

    res.status(200).json({
      message: 'Booking status updated successfully',
      data: updatedAppointment,
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
