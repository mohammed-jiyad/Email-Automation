import { Email } from "../emails/email.model.js";

export async function getStats(req, res) {
  const total = await Email.countDocuments();
  const autoReplied = await Email.countDocuments({ autoReplied: true });
  const failed = await Email.countDocuments({ deliveryStatus: "FAILED" });
  const pending = await Email.countDocuments({ deliveryStatus: "PENDING" });

  res.json({
    totalEmails: total,
    autoReplied,
    failedDeliveries: failed,
    pendingDeliveries: pending,
  });
}
