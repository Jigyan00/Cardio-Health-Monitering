import { useState, useCallback } from 'react';
import { ComplianceResult } from '../../../core/domain/Compliance';
import { complianceApi } from '../../../infrastructure/api';

export function useCompliance() {
  const [cb, setCb] = useState<ComplianceResult | null>(null);
  const [adjustedCB, setAdjustedCB] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateCB = useCallback(async (shipId: string, year: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await complianceApi.calculateCB(shipId, year);
      setCb(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to calculate CB';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAdjustedCB = useCallback(async (shipId: string, year: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await complianceApi.getAdjustedCB(shipId, year);
      setAdjustedCB(data.adjustedCB);
      return data.adjustedCB;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to get adjusted CB';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { cb, adjustedCB, loading, error, calculateCB, getAdjustedCB };
}
