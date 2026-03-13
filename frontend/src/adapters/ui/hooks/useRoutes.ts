import { useState, useEffect, useCallback } from 'react';
import { Route, RouteComparison, RouteFilters } from '../../../core/domain/Route';
import { routeApi } from '../../../infrastructure/api';

export function useRoutes() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoutes = useCallback(async (filters?: RouteFilters) => {
    setLoading(true);
    setError(null);
    try {
      const data = filters 
        ? await routeApi.filterRoutes(filters)
        : await routeApi.getAllRoutes();
      setRoutes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch routes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoutes();
  }, [fetchRoutes]);

  const setBaseline = useCallback(async (routeId: string) => {
    setError(null);
    try {
      await routeApi.setBaseline(routeId);
      await fetchRoutes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set baseline');
      throw err;
    }
  }, [fetchRoutes]);

  return { routes, loading, error, fetchRoutes, setBaseline };
}

export function useComparison() {
  const [comparisons, setComparisons] = useState<RouteComparison[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComparison = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await routeApi.getComparison();
      setComparisons(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch comparison');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComparison();
  }, [fetchComparison]);

  return { comparisons, loading, error, fetchComparison };
}
