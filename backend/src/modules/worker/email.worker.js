import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import { Worker } from "bullmq";
import mongoose from "mongoose";
import axios from "axios";

import { Email } from "../emails/email.model.js";
import { redisConnection } from "../../config/redis.js";

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Worker DB connected"))
  .catch((err) => console.error("Worker DB error:", err));

async function classifyEmail(subject, body) {
  try {
    const res = await axios.post(
      process.env.ML_SERVICE_URL || "http://localhost:8001/classify",
      { subject, body },
      { timeout: 5000 }
    );
    return res.data;
  } catch (err) {
    console.error("ML service failed:", err.message);
    return null;
  }
}

const worker = new Worker(
  "email-processing",
  async (job) => {
    const { emailId } = job.data;
    console.log("📩 Processing job:", emailId);

    const email = await Email.findById(emailId);
    if (!email) throw new Error("Email not found");

    const ml = await classifyEmail(email.subject, email.body);

    if (ml) {
      email.category = ml.category;
      email.confidence = ml.confidence;
      email.classifiedBy = ml.used_rules ? "HYBRID" : "BERT";
    } else {
      email.category = "Uncategorized";
      email.confidence = 0;
      email.classifiedBy = "NONE";
    }

    email.status = "PROCESSED";
    await email.save();

    return { success: true };
  },
  {
    connection: redisConnection,
  }
);

worker.on("completed", (job) => {
  console.log(`✅ Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`❌ Job ${job?.id} failed`, err);
});
