import { useState, useCallback } from 'react';
import { PoolCreationResult, PoolMemberInput } from '../../../core/domain/Pool';
import { poolingApi } from '../../../infrastructure/api';

export function usePooling() {
  const [poolResult, setPoolResult] = useState<PoolCreationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPool = useCallback(async (year: number, members: PoolMemberInput[]) => {
    setLoading(true);
    setError(null);
    try {
      const data = await poolingApi.createPool(year, members);
      setPoolResult(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create pool';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const validatePool = useCallback((members: PoolMemberInput[]): boolean => {
    const totalCB = members.reduce((sum, m) => sum + m.cb, 0);
    return totalCB >= 0;
  }, []);

  return { poolResult, loading, error, createPool, validatePool };
}
