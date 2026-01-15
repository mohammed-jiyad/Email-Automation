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
    enum: ["RECEIVED", "QUEUED", "PROCESSED","PROCESSED_WITHOUT_ML"],
    default: "RECEIVED",
  },

  // ✅ THESE MUST BE TOP-LEVEL FIELDS
  category: {
    type: String,
  },

  confidence: {
    type: Number,
  },

  classifiedBy: {
    type: String,
    enum: ["BERT", "HYBRID", "NONE"],
  },

  receivedAt: {
    type: Date,
    default: Date.now,
  },
  autoReplied: {
  type: Boolean,
  default: false,
},

autoReplyReason: {
  type: String,
},
autoReplyTemplate: {
  type: String,
},

autoReplyAt: {
  type: Date,
},
deliveryStatus: {
  type: String,
  enum: ["PENDING", "SENT", "FAILED"],
  default: "PENDING",
},


});

export const Email = mongoose.model("Email", emailSchema);
