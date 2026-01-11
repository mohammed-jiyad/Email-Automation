import { io } from "socket.io-client";
import { useEffect } from "react";

const socket = io("http://localhost:4000");

export default function useLiveEmails(onUpdate) {
  useEffect(() => {
    socket.on("email_updated", onUpdate);
    return () => socket.off("email_updated", onUpdate);
  }, [onUpdate]);
}
