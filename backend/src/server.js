// server.js
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import mongoose from "mongoose";
import app from "./app.js";
import { initSocket } from "./socket.js";
import http from "http";

const PORT = process.env.PORT || 4000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    const server = http.createServer(app);

    // 🔥 Attach socket.io to SAME server
    initSocket(server);

    // ✅ THIS IS THE IMPORTANT LINE
    server.listen(PORT, () => {
      console.log(`Server + WebSocket running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection error:", err);
  });
