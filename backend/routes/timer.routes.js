import express from "express";
import { addTimer, getAllTimer } from "../controllers/timer.controller.js";

const timerRouter = express.Router();

timerRouter.get("/", getAllTimer);
timerRouter.post("/", addTimer);

export default timerRouter;
