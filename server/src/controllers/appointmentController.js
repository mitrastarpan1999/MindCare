import prisma from '../config/database.js';

export const createAppointment = async (req, res) => {
  try {
    const { psychologistId, appointmentDate, startTime, endTime, consultationType, notes } = req.body;
    const patientId = req.user.id;

    if (!psychologistId || !appointmentDate || !startTime || !endTime) {
      return res.status(400).json({ message: 'All appointment details are required' });
    }

    // Verify patient and psychologist exist
    const patient = await prisma.patient.findUnique({ where: { id: patientId } });
    const psychologist = await prisma.psychologist.findUnique({ where: { id: psychologistId } });

    if (!patient || !psychologist) {
      return res.status(404).json({ message: 'Patient or psychologist not found' });
    }

    // Check if slot is already booked
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        psychologistId,
        appointmentDate: new Date(appointmentDate),
        startTime,
      },
    });

    if (existingAppointment) {
      return res.status(409).json({ message: 'This time slot is already booked' });
    }

    const appointment = await prisma.appointment.create({
      data: {
        patientId,
        psychologistId,
        appointmentDate: new Date(appointmentDate),
        startTime,
        endTime,
        consultationType: consultationType || 'online',
        notes,
        status: 'pending',
      },
      include: {
        psychologist: {
          select: {
            id: true,
            fullName: true,
            consultationFee: true,
          },
        },
      },
    });

    res.status(201).json({
      message: 'Appointment created successfully',
      data: appointment,
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getPatientAppointments = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.id !== id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const appointments = await prisma.appointment.findMany({
      where: { patientId: id },
      include: {
        psychologist: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            clinicAddress: true,
            consultationFee: true,
          },
        },
        payment: true,
      },
      orderBy: { appointmentDate: 'asc' },
    });

    res.status(200).json({
      message: 'Appointments retrieved successfully',
      data: appointments,
    });
  } catch (error) {
    console.error('Get patient appointments error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getPsychologistAppointments = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.id !== id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const appointments = await prisma.appointment.findMany({
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
      message: 'Appointments retrieved successfully',
      data: appointments,
    });
  } catch (error) {
    console.error('Get psychologist appointments error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        psychologist: true,
      },
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Only psychologist can update their appointments
    if (req.user.id !== appointment.psychologistId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: { status, statusNote: note || null },
      include: {
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
          },
        },
        payment: true,
      },
    });

    res.status(200).json({
      message: 'Appointment status updated successfully',
      data: updatedAppointment,
    });
  } catch (error) {
    console.error('Update appointment status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Only patient can cancel their appointments
    if (req.user.id !== appointment.patientId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const cancelledAppointment = await prisma.appointment.update({
      where: { id },
      data: { status: 'cancelled' },
      include: {
        psychologist: {
          select: {
            fullName: true,
          },
        },
      },
    });

    res.status(200).json({
      message: 'Appointment cancelled successfully',
      data: cancelledAppointment,
    });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
