import { BankEntry } from '../../domain/Banking';

export interface BankingRepository {
  findByShipAndYear(shipId: string, year: number): Promise<BankEntry[]>;
  save(entry: Omit<BankEntry, 'id' | 'createdAt'>): Promise<BankEntry>;
  getTotalBanked(shipId: string, year: number): Promise<number>;
}
