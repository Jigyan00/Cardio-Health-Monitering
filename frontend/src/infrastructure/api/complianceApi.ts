import { ComplianceResult, AdjustedCB } from '../../core/domain/Compliance';
import { CompliancePort } from '../../core/ports';
import { apiClient } from './client';

export class ComplianceApiAdapter implements CompliancePort {
  async calculateCB(shipId: string, year: number): Promise<ComplianceResult> {
    return apiClient.get<ComplianceResult>(`/compliance/cb?shipId=${shipId}&year=${year}`);
  }

  async getAdjustedCB(shipId: string, year: number): Promise<AdjustedCB> {
    return apiClient.get<AdjustedCB>(`/compliance/adjusted-cb?shipId=${shipId}&year=${year}`);
  }
}

export const complianceApi = new ComplianceApiAdapter();
