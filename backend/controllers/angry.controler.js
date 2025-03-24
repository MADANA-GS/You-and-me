import Angry from "../models/angry.model.js";

export const getAllAngry = async (req, res) => {
  try {
    const allAngry = await Angry.find().sort({ date: -1 });
    if (allAngry.length === 0) {
      return res.status(201).json({
        success: true,
        message: "No angry found",
        data: [],
      });
    }
    return res.status(200).json({
      success: true,
      message: "All angry fetched successfully",
      data: allAngry,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve our heartaches" });
  }
};
export const singleAngry = async (req, res) => {
  try {
    const { id } = req.params;
    const angryMessage = await Angry.findById(id);
    if (!angryMessage) {
      return res.status(404).json({ message: "Angry message not found" });
    }
    return res
      .status(200)
      .json({ message: "Angry message found", data: angryMessage });
  } catch (error) {
    res.status(500).json({ message: "Failed to find this heartache" });
  }
};

export const addAngry = async (req, res) => {
  try {
    let {
      date,
      time,
      duration,
      initiator,
      reason,
      resolution,
      notes,
      intensity,
    } = req.body;

    if (!time) {
      time = new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    }
    if (
      !date ||
      !time ||
      !duration ||
      !initiator ||
      !resolution ||
      !notes ||
      !intensity ||
      !reason ||
      !time
    ) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields" });
    }

    const newAngry = new Angry({
      date,
      time,
      duration,
      initiator,
      reason,
      resolution,
      notes,
      intensity,
    });
    const savedAngry = await newAngry.save();
    return res.status(201).json({
      message: "Angry added successfully",
      success: true,
      data: savedAngry,
    });
  } catch (error) {
    res.status(400).json({ message: "Failed to document your heartache" });
  }
};

export const deleteAngry = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAngry = await Angry.findByIdAndDelete(id);

    if (!deletedAngry) {
      return res.status(404).json({ message: "Angry message not found" });
    }

    return res.status(200).json({
      message: "Angry deleted successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete your heartache" });
  }
};
