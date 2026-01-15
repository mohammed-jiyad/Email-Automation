import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchEmailById } from "../api/emails";

export default function EmailDetails() {
  const { id } = useParams();
  const [email, setEmail] = useState(null);

  useEffect(() => {
    fetchEmailById(id).then(res => setEmail(res.data));
  }, [id]);

  if (!email) return <p style={{ padding: 24 }}>Loading email…</p>;

  return (
    <div className="details-page">
      <Link to="/" className="muted">
        ← Back to Dashboard
      </Link>

      <div className="details-layout">
        {/* LEFT */}
        <div className="details-main">
          <h2>{email.subject}</h2>

          <div className="details-meta">
            <span><strong>From:</strong> {email.from}</span>
            <span><strong>Category:</strong> {email.category || "—"}</span>
          </div>

          <h4>Email Body</h4>
          <div className="email-body">
            {email.body}
          </div>

          {/* 🔥 ACTIONS ROW */}
          <div className="details-actions">
            <button className="secondary-btn" disabled>
              Retry Automation
            </button>

            <button className="secondary-btn" disabled>
              View Raw JSON
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="details-side">
          <h4>Status</h4>
          <span className="status-pill success">
            {email.status}
          </span>

          <h4>Automation</h4>
          <p><strong>Auto Replied:</strong> {email.autoReplied ? "Yes" : "No"}</p>

          {email.autoReplied && (
            <>
              <p><strong>Template:</strong> {email.autoReplyTemplate}</p>
              <p><strong>Reason:</strong> {email.autoReplyReason}</p>
            </>
          )}

          <h4>Confidence</h4>
          <p>
            {email.confidence
              ? `${(email.confidence * 100).toFixed(2)}%`
              : "—"}
          </p>

          <h4>Received</h4>
          <p>{new Date(email.receivedAt).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
