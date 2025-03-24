import { Mood, RecordedMood } from "../models/RelationshipMoodSchema.js";

export const createMood = async (req, res) => {
  try {
    const { type, userId, note } = req.body;

    if (!type || !userId || !note) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }
    const newMood = new Mood({
      type,
      userId,
    });

    const savedMood = await newMood.save();

    const recordedMood = new RecordedMood({
      type,
      note,
      mood: savedMood._id,
    });

    const savedRecordedMood = await recordedMood.save();

    // Update Mood with recordedMood reference
    savedMood.recordedMoods.push(savedRecordedMood._id);
    await savedMood.save();

    res
      .status(201)
      .json({ message: "Mood recorded successfully", mood: savedMood });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getAllMoods = async (req, res) => {
  try {
    const moods = await Mood.find().populate("recordedMoods");
    res.status(200).json(moods);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
export const getAllRecordedMoods = async (req, res) => {
  try {
    const today = new Date();
    const twentyDaysAgo = new Date(today);
    twentyDaysAgo.setDate(today.getDate() - 20);

    // Delete recorded moods older than 20 days
    const oldRecordedMoods = await RecordedMood.find({ date: { $lt: twentyDaysAgo } });

    if (oldRecordedMoods.length > 0) {
      // Get associated Mood IDs
      const moodIds = oldRecordedMoods.map((mood) => mood.mood);

      // Delete old Recorded Moods
      await RecordedMood.deleteMany({ _id: { $in: oldRecordedMoods.map((m) => m._id) } });

      // Delete associated Mood documents
      await Mood.deleteMany({ _id: { $in: moodIds } });

      console.log(`Deleted ${oldRecordedMoods.length} old recorded moods.`);
    }

    // Get remaining recorded moods
    const recordedMoods = await RecordedMood.find().populate("mood");

    res.status(200).json(recordedMoods);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
