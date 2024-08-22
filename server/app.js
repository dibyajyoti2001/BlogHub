import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(cookieParser());

// routes import
import authRouter from "./routes/auth.route.js";
import postRouter from "./routes/post.route.js";
import commentRouter from "./routes/comment.route.js";

// routes declaration
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/comment", commentRouter);

// how it will see: http://localhost:5000/api/v1/auth/register

export { app };
