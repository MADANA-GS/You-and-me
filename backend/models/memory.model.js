import mongoose from "mongoose";

const MemorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  description: { type: String, required: true },
  thumbnailImage: { type: String, required: true },
  isLiked: { type: Boolean, default: false },
  images: [
    {
      image: { type: String, required: true },
      message: { type: String },
    },
  ],
});
const Memory = mongoose.model("Memory", MemorySchema);

export default Memory;
