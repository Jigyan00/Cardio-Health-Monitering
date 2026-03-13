import { v4 as uuidv4 } from 'uuid';
import { BankEntry } from '../../../core/domain/Banking';
import { BankingRepository } from '../../../core/ports/outbound/BankingRepository';

export class InMemoryBankingRepository implements BankingRepository {
  private entries: BankEntry[] = [];

  async findByShipAndYear(shipId: string, year: number): Promise<BankEntry[]> {
    return this.entries.filter(e => e.shipId === shipId && e.year === year);
  }

  async save(entry: Omit<BankEntry, 'id' | 'createdAt'>): Promise<BankEntry> {
    const newEntry: BankEntry = {
      ...entry,
      id: uuidv4(),
      createdAt: new Date(),
    };
    this.entries.push(newEntry);
    return newEntry;
  }

  async getTotalBanked(shipId: string, year: number): Promise<number> {
    const entries = await this.findByShipAndYear(shipId, year);
    return entries.reduce((sum, e) => sum + e.amountGco2eq, 0);
  }

  // For testing: clear all entries
  clear(): void {
    this.entries = [];
  }
}

// Singleton instance
export const bankingRepository = new InMemoryBankingRepository();
