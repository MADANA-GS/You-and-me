import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./lib/connectDB.js";
import timerRouter from "./routes/timer.routes.js";
import authRouter from "./routes/auth.router.js";
import angryRouter from "./routes/angry.routes.js";
import memoryRouter from "./routes/memory.route.js";
import uploadRouter from "./routes/imageUplaod.router.js";
import moodRoute from "./routes/mood.router.js";
import goalRouter from "./routes/goal.router.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.FRONTEND, // Allows all origins
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.json({ message: "Hello, World!" });
});

app.use("/timer", timerRouter);
app.use("/media", uploadRouter);
app.use("/auth", authRouter);
app.use("/memory", memoryRouter);
app.use("/angry-message", angryRouter);
app.use("/mood" , moodRoute);
app.use("/goal" , goalRouter);

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});
