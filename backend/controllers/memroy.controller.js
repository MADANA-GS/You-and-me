import Memory from "../models/memory.model.js";

// Get all memories
export const getAllMemories = async (req, res) => {
  try {
    const memories = await Memory.find();
    if (!memories || memories.length === 0) {
        return res.status(404).json({
        success: false,
        message: "No memories found",
        data: [],
      });
    }
    res.status(200).json({
      success: true,
      count: memories.length,
      message: "All memories fetched successfully",
      data: memories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to fetch memories server errror",
    });
  }
};

// Get single memory by ID
export const getMemoryById = async (req, res) => {
  try {
    const memory = await Memory.findById(req.params.id);

    if (!memory) {
      return res.status(404).json({
        success: false,
        error: "Memory not found",
      });
    }

    res.status(200).json({
      success: true,
      data: memory,
      message: "Memory found",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to fetch memory server error",
    });
  }
};

// Create a new memory
export const createMemory = async (req, res) => {
  try {
    const { title, date, description, thumbnailImage, images } = req.body;

    if (!title || !date || !description || !thumbnailImage) {
      return res.status(400).json({
        success: false,
        error: "Please provide all required fields",
      });
    }

    const newMemory = await Memory.create({
      title,
      date,
      description,
      thumbnailImage,
      images,
    });

    res.status(201).json({
      success: true,
      data: newMemory,
      message: "Memory created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to create memory server error",
    });
  }
};
