import dotenv from "dotenv";
dotenv.config();

import { Worker, Queue } from "bullmq";
import mongoose from "mongoose";

import { Email } from "../emails/email.model.js";
import { redisConnection } from "../../config/redis.js";
import { sendEmail } from "../replies/emailSender.js";
import templates from "../replies/templates.json" assert { type: "json" };

// Main processing queue (to re-enqueue on success)
const mainQueue = new Queue("email-processing", {
  connection: redisConnection,
});

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("DLQ Worker DB connected"))
  .catch((err) => console.error("DLQ Worker DB error:", err));

// DLQ Retry Worker
const dlqWorker = new Worker(
  "email-dlq",
  async (job) => {
    const { emailId, reason } = job.data;
    console.log("🔁 Retrying DLQ job for email:", emailId);

    const email = await Email.findById(emailId);
    if (!email) throw new Error("Email not found for DLQ retry");

    // Only retry auto-replies
    if (!email.autoReplyTemplate) {
      console.log("⏭️ Skipping DLQ job (no auto-reply template)");
      return;
    }

    const reply = templates[email.autoReplyTemplate];
    if (!reply) throw new Error("Missing email template");

    try {
      await sendEmail({
        to: email.from,
        subject: "Regarding your query",
        body: reply,
      });

      console.log("✅ DLQ retry succeeded for:", email.from);

      // Update DB
      email.deliveryStatus = "SENT";
      email.autoReplyAt = new Date();
      await email.save();

      // Re-enqueue to main queue for consistency (optional but clean)
      await mainQueue.add("email-retry-success", {
        emailId: email._id.toString(),
        retriedAt: new Date(),
      });

      return { retried: true };
    } catch (err) {
      console.error("❌ DLQ retry failed again:", err.message);

      email.deliveryStatus = "FAILED";
      await email.save();

      throw new Error("DLQ retry failed");
    }
  },
  {
    connection: redisConnection,
    concurrency: 3, // limit retries to avoid spam
  }
);

dlqWorker.on("completed", (job) => {
  console.log(`♻️ DLQ job ${job.id} completed`);
});

dlqWorker.on("failed", (job, err) => {
  console.error(`💥 DLQ job ${job?.id} failed permanently`, err.message);
});
