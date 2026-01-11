import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchEmailById } from "../api/emails";

export default function EmailDetails() {
  const { id } = useParams();
  const [email, setEmail] = useState(null);

  useEffect(() => {
    fetchEmailById(id).then((res) => setEmail(res.data));
  }, [id]);

  if (!email) return <p style={{ padding: 20 }}>Loading email...</p>;

  return (
    <div style={{ padding: 20, maxWidth: 800 }}>
      <Link to="/">← Back to Dashboard</Link>

      <h2 style={{ marginTop: 20 }}>{email.subject}</h2>

      <p><strong>From:</strong> {email.from}</p>
      <p><strong>Status:</strong> {email.status}</p>
      <p><strong>Category:</strong> {email.category || "—"}</p>
      <p>
        <strong>Confidence:</strong>{" "}
        {email.confidence
          ? `${(email.confidence * 100).toFixed(2)}%`
          : "—"}
      </p>

      <hr />

      <h3>Email Body</h3>
      <p style={{ whiteSpace: "pre-wrap" }}>{email.body}</p>

      <hr />

      <h3>Automation</h3>
      <p><strong>Auto Replied:</strong> {email.autoReplied ? "Yes" : "No"}</p>

      {email.autoReplied && (
        <>
          <p><strong>Template:</strong> {email.autoReplyTemplate}</p>
          <p><strong>Reason:</strong> {email.autoReplyReason}</p>
          <p>
            <strong>Auto Reply At:</strong>{" "}
            {new Date(email.autoReplyAt).toLocaleString()}
          </p>
        </>
      )}
    </div>
  );
}
