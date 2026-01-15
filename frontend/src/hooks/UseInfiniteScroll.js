import { useEffect, useRef } from "react";

export default function useInfiniteScroll(loadMore, enabled) {
  const ref = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // 🔥 IMPORTANT: stop observing immediately
          observerRef.current.disconnect();
          loadMore();
        }
      },
      {
        root: null,
        rootMargin: "200px", // preload earlier
        threshold: 0,
      }
    );

    if (ref.current) {
      observerRef.current.observe(ref.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [enabled, loadMore]);

  return ref;
}
