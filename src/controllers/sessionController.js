const Session = require("../models/session");
const Speaker = require("../models/speaker");
const User = require("../models/user");
const sendEmail = require("../utils/sendEmail");
const { addCalendarEvent } = require("../utils/calendar");

// Book a session with a speaker
exports.bookSession = async (req, res) => {
  const { speakerId, date, timeSlot } = req.body;
  const userId = req.user.id; // Authenticated user's ID

  try {
    // Validate request data
    if (!speakerId || !date || !timeSlot) {
      return res.status(400).json({ message: "Speaker ID, date, and time slot are required." });
    }

    // Check if the speaker exists
    const speaker = await Speaker.findByPk(speakerId);
    if (!speaker) {
      return res.status(404).json({ message: "Speaker not found." });
    }

    // Check if the time slot is already booked or blocked for the speaker
    const existingSession = await Session.findOne({
      where: {
        speakerId,
        date,
        timeSlot,
      },
    });

    if (existingSession && existingSession.status !== "cancelled") {
      return res.status(400).json({
        message: "This time slot is already blocked or booked.",
      });
    }

    // Create the new session booking
    const newSession = await Session.create({
      userId,
      speakerId,
      date,
      timeSlot,
      status: "booked", // Default status is "booked"
    });

    // Fetch user and speaker details for email and calendar
    const user = await User.findByPk(userId, { attributes: ["email", "firstName"] });
    const speakerUser = await User.findByPk(speaker.userId, { attributes: ["email", "firstName"] });

    const sessionDetails = `Date: ${date}\nTime Slot: ${timeSlot}\nSpeaker: ${speakerUser.firstName}\n\n Further details regarding the session will be shared by the speaker`;
    const sessionDetails1 = `Date: ${date}\nTime Slot: ${timeSlot}\nAttendee: ${user.firstName}\nAttendee's Email: ${user.email}`;


    // Send email to the user and speaker
    await sendEmail(
      user.email,
      "Session Booking Confirmation",
      `Your session has been successfully booked!\n\n${sessionDetails}`
    );
    await sendEmail(
      speakerUser.email,
      "New Session Booking",
      `A session has been booked with you!\n\n${sessionDetails1}`
    );

    // Add Google Calendar event
    const sessionStart = new Date(`${date}T${timeSlot.split(" - ")[0]}:00Z`);
    const sessionEnd = new Date(`${date}T${timeSlot.split(" - ")[1]}:00Z`);

    res.status(201).json({
      message: "Session booked successfully! Email notifications and calendar event created.",
      session: newSession,
    });
  } catch (error) {
    console.error("Error booking session:", error);
    res.status(500).json({
      message: "Error booking session.",
      error: error.message,
    });
  }
};

// Get sessions for a specific user
exports.getSessionsByUser = async (req, res) => {
  const userId = req.user.id;

  try {
    const sessions = await Session.findAll({
      where: { userId },
      include: [
        {
          model: Speaker,
          attributes: ["id", "expertise", "pricePerSession"],
        },
      ],
    });

    res.status(200).json({ sessions });
  } catch (error) {
    console.error("Error fetching user sessions:", error);
    res.status(500).json({
      message: "Error fetching sessions.",
      error: error.message,
    });
  }
};

// Get sessions for a specific speaker
exports.getSessionsBySpeaker = async (req, res) => {
  const { speakerId } = req.params;

  try {
    const sessions = await Session.findAll({
      where: { speakerId },
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName"],
        },
      ],
    });

    res.status(200).json({ sessions });
  } catch (error) {
    console.error("Error fetching speaker sessions:", error);
    res.status(500).json({
      message: "Error fetching sessions.",
      error: error.message,
    });
  }
};

// Block a time slot for a speaker
exports.blockTimeSlot = async (req, res) => {
  const { speakerId, date, timeSlot } = req.body;

  try {
    // Check if the speaker exists
    const speaker = await Speaker.findByPk(speakerId);
    if (!speaker) {
      return res.status(404).json({ message: "Speaker not found." });
    }

    // Check if the time slot is already blocked or booked
    const existingSession = await Session.findOne({
      where: {
        speakerId,
        date,
        timeSlot,
      },
    });

    if (existingSession) {
      return res.status(400).json({
        message: "This time slot is already blocked or booked.",
      });
    }

    // Block the time slot
    const blockedSlot = await Session.create({
      speakerId,
      date,
      timeSlot,
      status: "cancelled", // Use "cancelled" status for blocked slots
    });

    res.status(201).json({
      message: "Time slot blocked successfully!",
      session: blockedSlot,
    });
  } catch (error) {
    console.error("Error blocking time slot:", error);
    res.status(500).json({
      message: "Error blocking time slot.",
      error: error.message,
    });
  }
};