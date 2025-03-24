import mongoose from "mongoose";

const angrySchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  initiator: {
    type: String,
    required: true,
    enum: ["Me", "Partner", "Both"],
  },
  reason: {
    type: String,
    required: true,
  },
  resolution: {
    type: String,
    default: "",
  },
  notes: {
    type: String,
    default: "",
  },
  intensity: {
    type: String,
    default: "medium",
    enum: ["low", "medium", "high"],
  },
  // When this memory was captured
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Angry = mongoose.model("Angry", angrySchema);

export default Angry;
