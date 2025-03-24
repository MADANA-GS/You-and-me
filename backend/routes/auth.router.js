import express from "express";
import { checkAuth, googleLogin, logout } from "../controllers/user.controler.js";
import authMiddleware from "../middelwares/auth.middlerware.js";

const authRouter = express.Router();

authRouter.get("/google", googleLogin);
authRouter.post("/logout", logout);
authRouter.get("/check", authMiddleware, checkAuth);

export default authRouter;
