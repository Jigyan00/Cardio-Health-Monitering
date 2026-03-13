import { v4 as uuidv4 } from 'uuid';
import { ShipCompliance } from '../../../core/domain/Compliance';
import { ComplianceRepository } from '../../../core/ports/outbound/ComplianceRepository';

export class InMemoryComplianceRepository implements ComplianceRepository {
  private records: ShipCompliance[] = [];

  async findByShipAndYear(shipId: string, year: number): Promise<ShipCompliance | null> {
    return this.records.find(r => r.shipId === shipId && r.year === year) || null;
  }

  async save(compliance: Omit<ShipCompliance, 'id' | 'createdAt'>): Promise<ShipCompliance> {
    // Update existing or create new
    const existingIndex = this.records.findIndex(
      r => r.shipId === compliance.shipId && r.year === compliance.year
    );

    const record: ShipCompliance = {
      ...compliance,
      id: existingIndex >= 0 ? this.records[existingIndex].id : uuidv4(),
      createdAt: new Date(),
    };

    if (existingIndex >= 0) {
      this.records[existingIndex] = record;
    } else {
      this.records.push(record);
    }

    return record;
  }

  // For testing: clear all records
  clear(): void {
    this.records = [];
  }
}

// Singleton instance
export const complianceRepository = new InMemoryComplianceRepository();
