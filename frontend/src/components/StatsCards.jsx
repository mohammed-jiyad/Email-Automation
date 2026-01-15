export default function StatsCards({ stats }) {
  return (
    <div className="stats-grid">
      {/* Total Emails */}
      <div className="stat-card total">
        <div className="stat-title">Total Emails</div>
        <div className="stat-value">{stats.total ?? 0}</div>
      </div>

      {/* Auto Replied */}
      <div className="stat-card success">
        <div className="stat-title">Auto Replied</div>
        <div className="stat-value">{stats.autoReplied ?? 0}</div>
      </div>

      {/* Pending */}
      <div className="stat-card warning">
        <div className="stat-title">Pending</div>
        <div className="stat-value">{stats.pending ?? 0}</div>
      </div>

      {/* Failed */}
      <div className="stat-card danger">
        <div className="stat-title">Failed</div>
        <div className="stat-value">{stats.failed ?? 0}</div>
      </div>
    </div>
  );
}
