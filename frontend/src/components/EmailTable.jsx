import { useNavigate, Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";

export default function EmailTable({ emails }) {
  const navigate = useNavigate();

  if (!Array.isArray(emails)) return null;

  return (
    <table className="email-table">
      <thead>
        <tr>
          <th>From</th>
          <th>Subject</th>
          <th>Category</th>
          <th>Confidence</th>
          <th>Status</th>
          <th>Auto Reply</th>
        </tr>
      </thead>

      <tbody>
        {emails.map(email => (
          <tr
            key={email._id}
            className="email-row"
            data-status={email.status}
            role="button"
            tabIndex={0}
            onClick={() => navigate(`/emails/${email._id}`)}
            onKeyDown={e => {
              if (e.key === "Enter") {
                navigate(`/emails/${email._id}`);
              }
            }}
          >
            <td>{email.from}</td>

            <td>
              {/* Keep link look, prevent double navigation */}
              <Link
                to={`/emails/${email._id}`}
                className="link"
                onClick={e => e.stopPropagation()}
              >
                {email.subject}
              </Link>
            </td>

            <td>{email.category || "—"}</td>

            <td>
              {email.confidence
                ? `${(email.confidence * 100).toFixed(1)}%`
                : "—"}
            </td>

            <td>
              <StatusBadge status={email.status} />
            </td>

            <td>{email.autoReplied ? "Yes" : "No"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
