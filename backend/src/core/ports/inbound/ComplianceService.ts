import { ComplianceResult } from '../../domain/Compliance';

export interface ComplianceService {
  calculateCB(shipId: string, year: number): Promise<ComplianceResult>;
  getAdjustedCB(shipId: string, year: number): Promise<number>;
}
