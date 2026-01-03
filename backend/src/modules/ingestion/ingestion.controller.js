import { Email } from "../emails/email.model.js";
import { emailQueue } from "../queue/email.queue.js";

export const ingestEmail = async (req, res) => {
  const { messageId, from, subject, body } = req.body;

  if (!messageId || !from) {
    return res.status(400).json({ error: "messageId and from are required" });
  }

  try {
    // Save email (idempotent)
    const email = await Email.create({
      messageId,
      from,
      subject,
      body,
    });

    // Push job to queue
    await emailQueue.add("process-email", {
      emailId: email._id.toString(),
      messageId,
    });

    // Update status
    email.status = "QUEUED";
    await email.save();

    return res.status(200).json({
      success: true,
      message: "Email ingested successfully",
    });

  } catch (err) {
    // Duplicate email (idempotency case)
    if (err.code === 11000) {
      return res.status(200).json({
        success: true,
        message: "Duplicate email ignored",
      });
    }

    console.error("Ingestion error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
