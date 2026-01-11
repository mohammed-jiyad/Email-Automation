import { Email } from "./email.model.js";
import { emailQueue } from "../queue/email.queue.js";


export async function getEmails(req, res) {
  const {
    page = 1,
    limit = 10,
    category,
    autoReplied,
    status,           // ✅ ADD THIS
    deliveryStatus,
  } = req.query;

  const query = {};

  if (category) query.category = category;

  if (autoReplied !== undefined) {
    query.autoReplied = autoReplied === "true";
  }

  // ✅ THIS FIXES QUEUED / PROCESSED
  if (status) {
    query.status = status.toUpperCase();
  }

  // Optional: delivery tracking
  if (deliveryStatus) {
    query.deliveryStatus = deliveryStatus;
  }

  const emails = await Email.find(query)
    .sort({ receivedAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await Email.countDocuments(query);

  res.json({
    data: emails,
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
    },
  });
}


export async function getEmailById(req, res) {
  const email = await Email.findById(req.params.id);
  if (!email) return res.status(404).json({ message: "Not found" });
  res.json(email);
}

export async function retryEmail(req, res) {
  const email = await Email.findById(req.params.id);

  if (!email) {
    return res.status(404).json({ message: "Email not found" });
  }

  await emailQueue.add("retry-email", {
    emailId: email._id,
  });

  email.deliveryStatus = "PENDING";
  await email.save();

  res.json({ success: true });
}
