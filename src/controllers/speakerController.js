const Speaker = require("../models/speaker");
const User = require("../models/user"); // Import User model


exports.createSpeakerProfile = async (req, res) => {
  const { expertise, pricePerSession } = req.body;
  const userId = req.user.id;

  try {
    // Validate required fields
    if (!expertise || !pricePerSession) {
      return res.status(400).json({ message: "Expertise and price per session are required." });
    }

    // Check if the user already has a speaker profile
    const existingProfile = await Speaker.findOne({ where: { userId } });
    if (existingProfile) {
      return res.status(400).json({ message: "Speaker profile already exists." });
    }

    // Create a new speaker profile
    const newProfile = await Speaker.create({
      userId,
      expertise,
      pricePerSession,
    });

    res.status(201).json({
      message: "Speaker profile created successfully!",
      profile: newProfile,
    });
  } catch (error) {
    console.error("Error creating speaker profile:", error);
    res.status(500).json({ message: "Error creating speaker profile", error: error.message });
  }
};

// Get all speaker profiles
exports.getAllSpeakers = async (req, res) => {
    try {
      // Fetch speakers and join with the users table to get firstName and lastName
      const speakers = await Speaker.findAll({
        include: {
          model: User,
          attributes: ['firstName', 'lastName'], // Include firstName and lastName from the users table
        },
        attributes: ['id', 'expertise', 'pricePerSession', 'createdAt', 'updatedAt'],
      });
  
      res.status(200).json({ speakers });
    } catch (error) {
      console.error("Error fetching speakers:", error);
      res.status(500).json({ message: "Error fetching speakers", error: error.message });
    }
  };

// Get available time slots
exports.getAvailableSlots = async (req, res) => {
    try {
      const startHour = 9; // 9 AM
      const endHour = 16; // 4 PM
      const slots = [];
  
      // Generate hourly slots from startHour to endHour
      for (let hour = startHour; hour < endHour; hour++) {
        const startTime = `${hour}:00`;
        const endTime = `${hour + 1}:00`;
        slots.push(`${startTime} - ${endTime}`);
      }
  
      // Return response with available slots
      res.status(200).json({
        message: "Available slots fetched successfully.",
        availableSlots: slots,
      });
    } catch (error) {
      console.error("Error fetching available slots:", error);
      res.status(500).json({
        message: "Error fetching available slots.",
        error: error.message,
      });
    }
  };
  
