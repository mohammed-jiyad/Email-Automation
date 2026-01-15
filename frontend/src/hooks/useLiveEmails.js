import { io } from "socket.io-client";
import { useEffect, useRef } from "react";

const socket = io("https://email-automation-2-dmld.onrender.com");

export default function useLiveEmails(onUpdate) {
  const handlerRef = useRef(onUpdate);

  // always keep latest handler
  handlerRef.current = onUpdate;

  useEffect(() => {
    function handler(data) {
      handlerRef.current(data);
    }

    socket.off("email_updated"); // 🔥 CRITICAL
    socket.on("email_updated", handler);

    return () => {
      socket.off("email_updated", handler);
    };
  }, []);
}
