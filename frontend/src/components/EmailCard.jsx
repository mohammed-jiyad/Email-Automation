import { Link } from "react-router-dom";

export default function EmailCard({ email }) {
  return (
    <Link to={`/emails/${email._id}`} style={{ textDecoration: "none" }}>
      <div style={{
        border: "1px solid #ddd",
        padding: 16,
        borderRadius: 8,
        background: "#fff",
      }}>
        <p><b>From:</b> {email.from}</p>
        <p><b>Subject:</b> {email.subject}</p>
        <p><b>Category:</b> {email.category || "—"}</p>
        <p><b>Status:</b> {email.status}</p>
        <p><b>Auto Reply:</b> {email.autoReplied ? "✅" : "❌"}</p>

        {email.deliveryStatus === "FAILED" && (
          <button
            onClick={(e) => {
              e.preventDefault();
              fetch(`http://localhost:4000/emails/${email._id}/retry`, {
                method: "POST",
              });
            }}
            style={{
              marginTop: 10,
              padding: "6px 10px",
              background: "#ef4444",
              color: "#fff",
              border: "none",
              borderRadius: 4,
            }}
          >
            Retry
          </button>
        )}
      </div>
    </Link>
  );
}
