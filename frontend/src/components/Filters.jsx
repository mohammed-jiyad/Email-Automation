export default function Filters({ filters, setFilters }) {
  function update(key, value) {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined,
    }));
  }

  return (
    <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
      <select onChange={e => update("status", e.target.value)}>
        <option value="">All Status</option>
        <option value="QUEUED">Queued</option>
        <option value="PROCESSED">Processed</option>
      </select>

      <select onChange={e => update("autoReplied", e.target.value)}>
        <option value="">All Replies</option>
        <option value="true">Auto Replied</option>
        <option value="false">No Auto Reply</option>
      </select>

      <button onClick={() => setFilters({})}>View All</button>
    </div>
  );
}
