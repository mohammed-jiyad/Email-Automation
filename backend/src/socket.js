import { Server } from "socket.io";
import mongoose from "mongoose";
import { Email } from "./modules/emails/email.model.js";

let io;

export function initSocket(server) {
  io = new Server(server, {
    cors: { origin:  [
      "http://localhost:5173",
      "https://email-automation-nu-wine.vercel.app"
    ] },
  });

  io.on("connection", (socket) => {
    console.log("🔌 Client connected:", socket.id);
  });

  // 🔥 MongoDB Change Stream
  Email.watch().on("change", (change) => {
    if (change.operationType === "update") {
      Email.findById(change.documentKey._id).then((email) => {
        if (email) {
          io.emit("email_updated", email);
        }
      });
    }
  });
}
