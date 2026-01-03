import mongoose from "mongoose";

const emailSchema = new mongoose.Schema({
  messageId: {
    type: String,
    required: true,
    unique: true, // idempotency
  },
  from: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
  },
  body: {
    type: String,
  },
  status: {
    type: String,
    enum: ["RECEIVED", "QUEUED", "PROCESSED"],
    default: "RECEIVED",
  },
  receivedAt: {
    type: Date,
    default: Date.now,
  },
});

export const Email = mongoose.model("Email", emailSchema);
