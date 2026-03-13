import { BankEntry, BankingResult } from '../../domain/Banking';

export interface BankingService {
  getBankRecords(shipId: string, year: number): Promise<BankEntry[]>;
  bankSurplus(shipId: string, year: number, amount: number): Promise<BankingResult>;
  applyBanked(shipId: string, year: number, amount: number): Promise<BankingResult>;
  getAvailableBanked(shipId: string, year: number): Promise<number>;
}
