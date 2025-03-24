import mongoose from "mongoose";

const timerSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Timer = mongoose.model("Timer", timerSchema);
export default Timer;
