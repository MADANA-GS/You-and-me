import Timer from "../models/timer.model.js";

// Get all timers
export const getAllTimer = async (req, res) => {
  try {
    const timers = await Timer.find();
    if (!timers || timers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No timers found",
        data: [],
      });
    }
    res.status(200).json({
      success: true,
      message: "Timers fetched successfully",
      data: timers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching timers",
      error: error.message, // Fixed typo from "errror" to "error"
    });
  }
};
// Add a new timer
export const addTimer = async (req, res) => {
  try {
    const { date, message } = req.body;

    // Validation: Ensure required fields are provided
    if (!date || !message) {
      return res.status(400).json({
        success: false,
        message: "Please provide both date and message for the timer",
      });
    }

    // Create a new Timer instance
    const timer = new Timer({ date, message });
    await timer.save();

    return res.status(201).json({
      success: true,
      message: "Timer added successfully",
      data: timer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding timer",
      error: error.message, // Fixed typo
    });
  }
};
