import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import { Worker } from "bullmq";
import mongoose from "mongoose";
import axios from "axios";

import { Email } from "../emails/email.model.js";
import { redisConnection } from "../../config/redis.js";

import { AUTO_REPLY_POLICY } from "../replies/autoReplyPolicy.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const templates = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "../replies/templates.json"),
    "utf-8"
  )
);


import { emailDLQ } from "../queue/email.dlq.js";
import { sendEmail } from "../replies/emailSender.js";

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Worker DB connected"))
  .catch((err) => console.error("Worker DB error:", err));

async function classifyEmail(subject, body) {
  try {
    const ml_Service=process.env.ML_SERVICE_URL || "http://localhost:8001";
    const res = await axios.post(
      `${ml_Service}/classify`,
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

/* ===========================
   AUTO-REPLY LOGIC (HERE)
   =========================== */

const policy = AUTO_REPLY_POLICY[email.category];
if (policy?.enabled && email.confidence >= policy.threshold) {
  const reply = templates[email.category];

  if (reply) {
    try {
      await sendEmail({
        to: email.from,
        subject: "Regarding your query",
        body: reply,
      });

      console.log("📤 Auto-reply email sent to:", email.from);

      email.autoReplied = true;
email.deliveryStatus = "SENT";
email.autoReplyTemplate = email.category;
email.autoReplyReason = `Confidence ${email.confidence} >= ${policy.threshold}`;
email.autoReplyAt = new Date();


    } catch (err) {
      console.error("❌ Email sending failed:", err.message);

      email.deliveryStatus = "FAILED";
await email.save(); // save failure state before throwing
throw new Error("Email delivery failed");
    }
  }
}



/* ===========================
   END AUTO-REPLY LOGIC
   =========================== */

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

worker.on("failed", async (job, err) => {
  console.error(`❌ Job ${job?.id} failed`, err.message);

  await emailDLQ.add("failed-email", {
    emailId: job?.data?.emailId,
    reason: err.message,
    failedAt: new Date(),
  });
});
