import { useCallback, useEffect, useRef, useState } from 'react';

export default function usePagedProducts({ fetcher, params, perPage = 24, resetKey }) {
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const pageRef = useRef(1);
  const idRef = useRef(0);
  const fetcherRef = useRef(fetcher);
  const paramsKey = JSON.stringify(params || {});

  useEffect(() => {
    fetcherRef.current = fetcher;
  }, [fetcher]);

  useEffect(() => {
    let cancelled = false;
    const id = ++idRef.current;
    setLoading(true);
    setError(false);
    fetcherRef.current({ page: 1, perPage, ...JSON.parse(paramsKey) })
      .then((res) => {
        if (!cancelled && id === idRef.current) {
          setProducts(res.items);
          setTotal(res.total);
          setTotalPages(res.totalPages);
          pageRef.current = 1;
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled && id === idRef.current) {
          setError(true);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [paramsKey, perPage, resetKey]);

  const loadMore = useCallback(() => {
    const p = { page: pageRef.current + 1, perPage, ...JSON.parse(paramsKey) };
    const id = idRef.current;
    setLoadingMore(true);
    fetcherRef.current(p)
      .then((res) => {
        if (id === idRef.current) {
          setProducts((prev) => [...(prev || []), ...res.items]);
          setTotal(res.total);
          setTotalPages(res.totalPages);
          pageRef.current = p.page;
        }
      })
      .catch(() => {})
      .finally(() => {
        if (id === idRef.current) setLoadingMore(false);
      });
  }, [paramsKey, perPage]);

  const hasMore = !loading && !loadingMore && !error && pageRef.current < totalPages;

  return { products, loading, loadingMore, error, total, totalPages, hasMore, loadMore };
}
