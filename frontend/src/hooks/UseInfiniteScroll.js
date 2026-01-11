import { useEffect, useRef } from "react";

export default function useInfiniteScroll(loadMore, enabled) {
  const ref = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadMore();
      },
      { threshold: 1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [enabled, loadMore]);

  return ref;
}
