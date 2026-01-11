export default function StatusBadge({ status }) {
  const map = {
    PROCESSED: "#16a34a",
    QUEUED: "#facc15",
    FAILED: "#dc2626",
  };

  return (
    <span
      style={{
        padding: "4px 10px",
        borderRadius: "999px",
        background: map[status] || "#9ca3af",
        color: "#fff",
        fontSize: "12px",
      }}
    >
      {status}
    </span>
  );
}
