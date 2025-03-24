import Goal from "../models/goal.model.js";

// Create a Goal
export const createGoal = async (req, res) => {
  try {
    const { priority, targetDate, description, title } = req.body;
    
    if (!priority || !targetDate || !description || !title) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const newGoal = await Goal.create({ priority, targetDate, description, title });

    return res.status(201).json({
      success: true,
      data: newGoal,
      message: "Goal created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error creating goal",
      error: error.message,
    });
  }
};

// Get All Goals
export const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find();
    
    return res
      .status(200)
      .json({ success: true, message: "All goals fetched", data: goals });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching goals",
      error: error.message,
    });
  }
};

// Delete a Goal
export const deleteGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedGoal = await Goal.findByIdAndDelete(id);

    if (!deletedGoal) {
      return res.status(404).json({ success: false, message: "Goal not found" });
    }

    return res.status(200).json({ success: true, message: "Goal deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting goal",
      error: error.message,
    });
  }
};

// Update Goal Progress
export const updateGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const { progress } = req.body;

    // ✅ Validate progress (must be between 0 and 100)
    if (progress < 0 || progress > 100) {
      return res.status(400).json({ success: false, message: "Progress must be between 0 and 100" });
    }

    const updatedGoal = await Goal.findByIdAndUpdate(
      id,
      { progress },
      { new: true }
    );

    if (!updatedGoal) {
      return res.status(404).json({ success: false, message: "Goal not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Goal progress updated successfully",
      data: updatedGoal,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating goal",
      error: error.message,
    });
  }
};
