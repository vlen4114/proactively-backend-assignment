const express = require("express");
const { authenticateToken, authorizeRole } = require("../middlewares/authMiddleware");
const { 
  createSpeakerProfile, 
  getAllSpeakers, 
  getAvailableSlots 
} = require("../controllers/speakerController");

const router = express.Router();

// Route: Speaker profile setup (protected for speakers only)
router.post(
  "/setup-profile",
  authenticateToken,
  authorizeRole(["speaker"]), // Allow only "speaker" role
  createSpeakerProfile
);

// Route: Get all speakers (public)
router.get("/", getAllSpeakers);

// Route: Get available time slots (public)
router.get("/available-slots", getAvailableSlots);

module.exports = router;