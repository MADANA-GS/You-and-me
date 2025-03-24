import express from "express";
import {
  createMood,
  getAllMoods,
  getAllRecordedMoods,
} from "../controllers/Mood.controller.js";

const moodRoute = express.Router();

moodRoute.post("/", createMood);
moodRoute.get("/", getAllMoods);
moodRoute.get("/recorded-moods", getAllRecordedMoods);

export default moodRoute;
