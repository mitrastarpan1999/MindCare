import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import {
  uploadPatientProfilePicture,
  uploadPsychologistProfilePicture,
  getPatientProfile,
  updatePatientProfile,
  getPsychologistProfile,
  updatePsychologistProfile,
} from "../controllers/profileController.js";

const router = express.Router();

// Patient profile routes
router.get("/patient", authenticateToken, getPatientProfile);
router.put("/patient", authenticateToken, updatePatientProfile);
router.post(
  "/patient/upload-picture",
  authenticateToken,
  upload.single("profilePicture"),
  uploadPatientProfilePicture
);

// Psychologist profile routes
router.get("/psychologist", authenticateToken, getPsychologistProfile);
router.put("/psychologist", authenticateToken, updatePsychologistProfile);
router.post(
  "/psychologist/upload-picture",
  authenticateToken,
  upload.single("profilePicture"),
  uploadPsychologistProfilePicture
);

export default router;
