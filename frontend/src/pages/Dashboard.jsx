import { useEffect, useState, useCallback, useRef } from "react";
import StatsCards from "../components/StatsCards";
import Filters from "../components/Filters";
import EmailTable from "../components/EmailTable";
import useLiveEmails from "../hooks/useLiveEmails";
import { Link } from "react-router-dom";

const CARD_HEIGHT = 160;

export default function Dashboard() {
  const [emails, setEmails] = useState([]);
  const [stats, setStats] = useState({});
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const pageRef = useRef(1);
  const limit = Math.ceil(window.innerHeight / CARD_HEIGHT) * 3;

  /* ---------------- LOAD STATS ---------------- */
  const loadStats = useCallback(async () => {
    const res = await fetch("https://email-automation-2-dmld.onrender.com/stats");
    const data = await res.json();

    setStats({
      total: data.total,
      autoReplied: data.autoReplied,
      pending: data.pending,
      failed: data.failed,
    });
  }, []);

  /* ---------------- LOAD EMAILS ---------------- */
  const fetchEmails = useCallback(
    async ({ reset = false } = {}) => {
      if (loading) return;

      setLoading(true);

      const page = reset ? 1 : pageRef.current;

      const params = new URLSearchParams({
        ...filters,
        page,
        limit,
      });

      try {
        const res = await fetch(
          `https://email-automation-2-dmld.onrender.com/emails?${params}`
        );
        const json = await res.json();

        setEmails(prev =>
          reset ? json.data : [...prev, ...json.data]
        );

        pageRef.current = page + 1;
        setHasMore(json.data.length === limit);
      } catch (err) {
        console.error("Failed to load emails", err);
      } finally {
        setLoading(false);
      }
    },
    [filters, loading, limit]
  );

  /* ---------------- INITIAL LOAD ---------------- */
  useEffect(() => {
    pageRef.current = 1;
    fetchEmails({ reset: true });
    loadStats();
  }, []); // run ONCE

  /* ---------------- FILTER CHANGE ---------------- */
  useEffect(() => {
    pageRef.current = 1;
    fetchEmails({ reset: true });
    loadStats();
  }, [filters]);

  /* ---------------- LIVE UPDATES ---------------- */
  useLiveEmails(updatedEmail => {
    setEmails(prev => {
      const index = prev.findIndex(e => e._id === updatedEmail._id);
      if (index !== -1) {
        const copy = [...prev];
        copy[index] = updatedEmail;
        return copy;
      }
      return [updatedEmail, ...prev];
    });

    loadStats();
  });

  /* ---------------- UI ---------------- */
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Email Automation</h1>
  
        </div>

        <Link to="/tester" className="primary-btn">
          + Workflow Tester
        </Link>
      </div>

      <StatsCards stats={stats} />

      <div className="toolbar">
        <Filters filters={filters} setFilters={setFilters} />
      </div>

      <div className={`table-card ${loading ? "loading" : ""}`}>

        <EmailTable emails={emails} loading={loading} />
      </div>

      {hasMore && (
        <div style={{ padding: 20, textAlign: "center" }}>
          <button
            onClick={() => fetchEmails()}
            disabled={loading}
            className="primary-btn"
          >
            {loading ? "Loading…" : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
}
