export default function StatusBadge({ status }) {
  const map = {
    PROCESSED: { bg: "var(--success-bg)", text: "var(--success-text)" },
    QUEUED: { bg: "var(--warn-bg)", text: "var(--warn-text)" },
    FAILED: { bg: "var(--danger-bg)", text: "var(--danger-text)" },
  };

  const colors = map[status] || {
    bg: "#e5e7eb",
    text: "#374151",
  };

  return (
    <span style={{
      padding: "4px 10px",
      borderRadius: 999,
      background: colors.bg,
      color: colors.text,
      fontSize: 12,
      fontWeight: 500
    }}>
      {status}
    </span>
  );
}
