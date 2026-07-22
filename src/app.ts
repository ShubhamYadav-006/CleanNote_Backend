import express from "express";
import cors from "cors";
import noteRoutes from "./routes/noteRoutes.js";
import authRoutes from "./routes/authRoutes.js";


const app = express();

// CORS Configuration
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://clean-note-frontend.vercel.app",
    ],
    credentials: true,
  })
);

// Middleware
app.use(express.json());


// Routes
app.use("/auth", authRoutes);
app.use("/notes", noteRoutes);

export default app;