import { BankEntry, BankingResult } from '../../core/domain/Banking';
import { BankingPort } from '../../core/ports';
import { apiClient } from './client';

export class BankingApiAdapter implements BankingPort {
  async getBankRecords(shipId: string, year: number): Promise<BankEntry[]> {
    return apiClient.get<BankEntry[]>(`/banking/records?shipId=${shipId}&year=${year}`);
  }

  async bankSurplus(shipId: string, year: number, amount: number): Promise<BankingResult> {
    return apiClient.post<BankingResult>('/banking/bank', { shipId, year, amount });
  }

  async applyBanked(shipId: string, year: number, amount: number): Promise<BankingResult> {
    return apiClient.post<BankingResult>('/banking/apply', { shipId, year, amount });
  }
}

export const bankingApi = new BankingApiAdapter();
