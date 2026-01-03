import dotenv from "dotenv";
dotenv.config({ path: "./.env" }); // 👈 REQUIRED

import mongoose from "mongoose";
import app from "./app.js";

const PORT = process.env.PORT || 4000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection error:", err);
  });
