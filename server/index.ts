import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { checkUserIds, getUserDevices } from "./routes/user";
import { chatAPI } from "./routes/chat";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // ORIN AI API routes
  app.get("/api/check_user_ids", checkUserIds);
  app.get("/api/user/:id", getUserDevices);
  app.post("/api/chat", chatAPI);

  return app;
}
