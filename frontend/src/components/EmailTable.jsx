import { Link } from "react-router-dom";

export default function EmailTable({ emails }) {
  if (!Array.isArray(emails)) return null;

  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr style={{ background: "#f3f4f6" }}>
          <th>From</th>
          <th>Subject</th>
          <th>Category</th>
          <th>Confidence</th>
          <th>Status</th>
          <th>Auto Reply</th>
        </tr>
      </thead>

      <tbody>
        {emails.map((email) => (
          <tr key={email._id} style={{ borderBottom: "1px solid #ddd" }}>
            <td>{email.from}</td>
            <td>{email.subject}</td>
            <td>{email.category || "—"}</td>
            <td>
              {email.confidence
                ? `${(email.confidence * 100).toFixed(1)}%`
                : "—"}
            </td>
            <td>{email.status}</td>
            <td>{email.autoReplied ? "✅ Yes" : "❌ No"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
