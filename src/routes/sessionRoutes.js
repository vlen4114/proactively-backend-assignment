const express = require("express"); 
const { authenticateToken, authorizeRole } = require("../middlewares/authMiddleware");
const { bookSession, blockTimeSlot } = require("../controllers/sessionController");

const router = express.Router();

// Route for booking a session
router.post("/book", authenticateToken, bookSession);

// Route for blocking a time slot (protected for speakers only)
router.post(
  "/block-time-slot",
  authenticateToken,
  authorizeRole(["speaker"]), // Only speakers can block time slots
  blockTimeSlot
);

module.exports = router;
