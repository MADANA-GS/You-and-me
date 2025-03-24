import express from "express";
import { createMemory, getAllMemories, getMemoryById } from "../controllers/memroy.controller.js";

const memoryRouter = express.Router();

memoryRouter.get("/", getAllMemories);
memoryRouter.get("/:id", getMemoryById);
memoryRouter.post("/", createMemory);  // Add this route for creating a new memory

export default memoryRouter;
