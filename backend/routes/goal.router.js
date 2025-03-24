import express from "express";
import { createGoal, deleteGoal, getGoals, updateGoal } from "../controllers/goal.controller.js";

const goalRouter = express.Router();

goalRouter.get("/", getGoals);
goalRouter.post("/", createGoal);
goalRouter.delete("/:id", deleteGoal);
goalRouter.patch("/:id/progress", updateGoal); // ✅ PATCH is better for partial updates

export default goalRouter;
