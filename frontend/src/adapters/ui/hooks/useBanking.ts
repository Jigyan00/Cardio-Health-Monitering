import { useState, useCallback } from 'react';
import { BankEntry, BankingResult } from '../../../core/domain/Banking';
import { bankingApi } from '../../../infrastructure/api';

export function useBanking() {
  const [records, setRecords] = useState<BankEntry[]>([]);
  const [result, setResult] = useState<BankingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecords = useCallback(async (shipId: string, year: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await bankingApi.getBankRecords(shipId, year);
      setRecords(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch records';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const bankSurplus = useCallback(async (shipId: string, year: number, amount: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await bankingApi.bankSurplus(shipId, year, amount);
      setResult(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to bank surplus';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const applyBanked = useCallback(async (shipId: string, year: number, amount: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await bankingApi.applyBanked(shipId, year, amount);
      setResult(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to apply banked';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { records, result, loading, error, fetchRecords, bankSurplus, applyBanked };
}
