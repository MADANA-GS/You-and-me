import mongoose from 'mongoose';

// Recorded Mood Schema
const RecordedMoodSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["sunny", "cloudy", "rainy", "stormy", "snowy", "electric", "loving"],
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  note: {
    type: String,
    required: true
  },
  mood: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mood'
  }
});

// Main Mood Schema
const MoodSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["sunny", "cloudy", "rainy", "stormy", "snowy", "electric", "loving"],
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  recordedMoods: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RecordedMood'
  }],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const Mood = mongoose.model('Mood', MoodSchema);
const RecordedMood = mongoose.model('RecordedMood', RecordedMoodSchema);

export { Mood, RecordedMood };
