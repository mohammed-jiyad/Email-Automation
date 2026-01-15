import { useState } from "react";
import { Link } from "react-router-dom";

const TEST_CASES = [
  {
    id: "product_availability",
    label: "Product Availability",
    subject: "Will the black leather backpack restock?",
    body: "I saw this item is out of stock. Will it be available again soon?",
  },
  {
    id: "order_status",
    label: "Order Status Request",
    subject: "Track my order #ORD-12345",
    body: "Has it been processed or shipped yet? Please provide the current order status for order #ORD-12345.",
  },
  {
    id: "password_reset",
    label: "Password Reset",
    subject: "Unable to login",
    body: "I forgot my password and can’t access my account.",
  },
  {
    id: "shipping_update",
    label: "Shipping Update",
    subject: "Shipping update request",
    body: "Has my order been shipped already?",
  },
];

export default function WorkflowTester() {
  const [selected, setSelected] = useState(TEST_CASES[0]);
  const [from, setFrom] = useState("user@example.com");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  async function sendTestEmail() {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(
        "http://localhost:4000/ingest/webhook/email",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messageId: `workflow-test-${Date.now()}`,
            from,
            subject: selected.subject,
            body: selected.body,
          }),
        }
      );

      if (!res.ok) throw new Error("Ingestion failed");

      const json = await res.json();
      setResult(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-shell">
      <div className="tester-surface">
        <div className="tester-container">
          <div className="tester-header">
            <Link to="/" className="tester-back">
              ← Back to Dashboard
            </Link>

            <h2>Workflow Tester</h2>
            <p className="muted">
              Simulate an incoming email and observe the automation pipeline.
            </p>
          </div>

          <div className="tester-form">
            <label>Select Test Scenario</label>
            <select
              value={selected.id}
              onChange={e =>
                setSelected(
                  TEST_CASES.find(t => t.id === e.target.value)
                )
              }
            >
              {TEST_CASES.map(tc => (
                <option key={tc.id} value={tc.id}>
                  {tc.label}
                </option>
              ))}
            </select>

            <label>From</label>
            <input
              value={from}
              onChange={e => setFrom(e.target.value)}
            />

            <label className="locked-label">
              Subject <span className="lock-icon">🔒</span>
            </label>
            <input
              value={selected.subject}
              readOnly
              className="locked-input"
            />

            <label className="locked-label">
              Email Body <span className="lock-icon">🔒</span>
            </label>
            <textarea
              value={selected.body}
              rows={4}
              readOnly
              className="locked-textarea"
            />

            <div className="tester-actions">
              <button
                onClick={sendTestEmail}
                disabled={loading}
                className="primary-btn"
              >
                {loading ? "Sending…" : "Send Test Email"}
              </button>
            </div>

            {result && (
              <div className="tester-result">
                <strong>✅ Email queued successfully</strong>
                <pre>{JSON.stringify(result, null, 2)}</pre>
              </div>
            )}

            {error && (
              <div className="tester-error">
                ❌ {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
