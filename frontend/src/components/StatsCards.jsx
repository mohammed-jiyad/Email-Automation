export default function StatsCards({ stats }) {
  if (!stats) return null;

  const cardStyle = {
    padding: 16,
    borderRadius: 8,
    background: "#f9fafb",
    textAlign: "center",
    flex: 1,
  };

  return (
    <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
      <div style={cardStyle}>
        <h3>Total</h3>
        <strong>{stats.total ?? 0}</strong>
      </div>

      <div style={cardStyle}>
        <h3>Auto Replied</h3>
        <strong>{stats.autoReplied ?? 0}</strong>
      </div>

      <div style={cardStyle}>
        <h3>Pending</h3>
        <strong>{stats.pending ?? 0}</strong>
      </div>

      <div style={cardStyle}>
        <h3>Failed</h3>
        <strong>{stats.failed ?? 0}</strong>
      </div>
    </div>
  );
}
