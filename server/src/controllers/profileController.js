import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import prisma from "../config/database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Upload profile picture for patient
export const uploadPatientProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const patientId = req.user.id;
    const filePath = `/uploads/${req.file.filename}`;

    // Update patient with profile picture path
    const updatedPatient = await prisma.patient.update({
      where: { id: patientId },
      data: { profilePicture: filePath },
      select: {
        id: true,
        fullName: true,
        email: true,
        profilePicture: true,
      },
    });

    res.json({
      message: "Profile picture uploaded successfully",
      patient: updatedPatient,
    });
  } catch (error) {
    console.error("Error uploading patient profile picture:", error);
    res.status(500).json({ error: "Failed to upload profile picture" });
  }
};

// Upload profile picture for psychologist
export const uploadPsychologistProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const psychologistId = req.user.id;
    const filePath = `/uploads/${req.file.filename}`;

    // Update psychologist with profile picture path
    const updatedPsychologist = await prisma.psychologist.update({
      where: { id: psychologistId },
      data: { profilePicture: filePath },
      select: {
        id: true,
        fullName: true,
        email: true,
        profilePicture: true,
      },
    });

    res.json({
      message: "Profile picture uploaded successfully",
      psychologist: updatedPsychologist,
    });
  } catch (error) {
    console.error("Error uploading psychologist profile picture:", error);
    res.status(500).json({ error: "Failed to upload profile picture" });
  }
};

// Get patient profile
export const getPatientProfile = async (req, res) => {
  try {
    const patient = await prisma.patient.findUnique({
      where: { id: req.user.id },
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

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    res.json(patient);
  } catch (error) {
    console.error("Error fetching patient profile:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

// Update patient profile
export const updatePatientProfile = async (req, res) => {
  try {
    const { fullName, age, gender, city, state, phone } = req.body;

    const updatedPatient = await prisma.patient.update({
      where: { id: req.user.id },
      data: {
        ...(fullName && { fullName }),
        ...(age && { age: parseInt(age) }),
        ...(gender && { gender }),
        ...(city && { city }),
        ...(state && { state }),
        ...(phone && { phone }),
      },
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
      },
    });

    res.json({
      message: "Profile updated successfully",
      patient: updatedPatient,
    });
  } catch (error) {
    console.error("Error updating patient profile:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

// Get psychologist profile
export const getPsychologistProfile = async (req, res) => {
  try {
    const psychologist = await prisma.psychologist.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        gender: true,
        clinicAddress: true,
        qualifications: true,
        specialization: true,
        licenseNumber: true,
        licenseDocUrl: true,
        profilePicture: true,
        yearsExperience: true,
        rating: true,
        consultationFee: true,
        about: true,
        createdAt: true,
      },
    });

    if (!psychologist) {
      return res.status(404).json({ error: "Psychologist not found" });
    }

    res.json(psychologist);
  } catch (error) {
    console.error("Error fetching psychologist profile:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

// Update psychologist profile
export const updatePsychologistProfile = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      gender,
      clinicAddress,
      qualifications,
      specialization,
      yearsExperience,
      consultationFee,
      about,
    } = req.body;

    const updatedPsychologist = await prisma.psychologist.update({
      where: { id: req.user.id },
      data: {
        ...(fullName && { fullName }),
        ...(phone && { phone }),
        ...(gender && { gender }),
        ...(clinicAddress && { clinicAddress }),
        ...(qualifications && { qualifications }),
        ...(specialization && { specialization }),
        ...(yearsExperience && { yearsExperience: parseInt(yearsExperience) }),
        ...(consultationFee && { consultationFee: parseFloat(consultationFee) }),
        ...(about && { about }),
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        gender: true,
        clinicAddress: true,
        qualifications: true,
        specialization: true,
        licenseNumber: true,
        profilePicture: true,
        yearsExperience: true,
        rating: true,
        consultationFee: true,
        about: true,
      },
    });

    res.json({
      message: "Profile updated successfully",
      psychologist: updatedPsychologist,
    });
  } catch (error) {
    console.error("Error updating psychologist profile:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
};
