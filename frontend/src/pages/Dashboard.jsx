import { useEffect, useState, useCallback } from "react";
import StatsCards from "../components/StatsCards";
import Filters from "../components/Filters";
import EmailCardsGrid from "../components/EmailCardsGrid";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import useLiveEmails from "../hooks/useLiveEmails";

const CARD_HEIGHT = 160;

export default function Dashboard() {
  const [emails, setEmails] = useState([]);
  const [stats, setStats] = useState({});
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const limit = Math.ceil(window.innerHeight / CARD_HEIGHT) * 3;

  const loadEmails = useCallback(async (reset = false) => {
    if (loading) return;

    setLoading(true);
    const currentPage = reset ? 1 : page;

    const params = new URLSearchParams({
      ...filters,
      page: currentPage,
      limit,
    });

    const res = await fetch(`http://localhost:4000/emails?${params}`);
    const json = await res.json();

    setEmails((prev) =>
      reset ? json.data : [...prev, ...json.data]
    );

    setHasMore(
      (reset ? 0 : emails.length) + json.data.length < json.meta.total
    );

    setPage(currentPage + 1);

    const statsRes = await fetch("http://localhost:4000/stats");
    setStats(await statsRes.json());

    setLoading(false);
  }, [filters, page, loading, emails.length, limit]);

  // Reload when filters change
  useEffect(() => {
    setEmails([]);
    setPage(1);
    setHasMore(true);
    loadEmails(true);
  }, [filters]);

  // 🔴 LIVE EMAIL UPDATES (WebSocket)
  useLiveEmails((updatedEmail) => {
    setEmails((prev) => {
      const index = prev.findIndex(e => e._id === updatedEmail._id);

      if (index !== -1) {
        const copy = [...prev];
        copy[index] = updatedEmail;
        return copy;
      }

      return [updatedEmail, ...prev];
    });
  });

  // Infinite scroll trigger
  const loadMoreRef = useInfiniteScroll(
    () => loadEmails(false),
    hasMore && !loading
  );

  return (
    <div style={{ padding: 24 }}>
      <h1 onClick={() => setFilters({})} style={{ cursor: "pointer" }}>
        Email Automation Dashboard
      </h1>

      <StatsCards stats={stats} />
      <Filters filters={filters} setFilters={setFilters} />

      <EmailCardsGrid emails={emails} />

      {hasMore && (
        <div ref={loadMoreRef} style={{ padding: 20, textAlign: "center" }}>
          {loading && "Loading more…"}
        </div>
      )}
    </div>
  );
}
