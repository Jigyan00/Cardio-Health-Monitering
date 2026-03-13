export interface ComplianceResult {
  shipId: string;
  year: number;
  actualIntensity: number;
  targetIntensity: number;
  energyInScope: number;
  complianceBalance: number;
}

export interface AdjustedCB {
  shipId: string;
  year: number;
  adjustedCB: number;
}
