import express from "express";
import {
  addAngry,
  deleteAngry,
  getAllAngry,
  singleAngry,
} from "../controllers/angry.controler.js";

const angryRouter = express.Router();

angryRouter.get("/", getAllAngry);
angryRouter.get("/:id", singleAngry);
angryRouter.post("/", addAngry);
angryRouter.delete("/:id", deleteAngry);

export default angryRouter;
