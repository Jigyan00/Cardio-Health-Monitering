export const TARGET_INTENSITY_2025 = 89.3368; // gCO₂e/MJ (2% below 91.16)
export const MJ_PER_TONNE = 41000; // Energy conversion factor

export interface ShipCompliance {
  id: string;
  shipId: string;
  year: number;
  cbGco2eq: number; // Compliance Balance in gCO2eq
  createdAt: Date;
}

export interface ComplianceResult {
  shipId: string;
  year: number;
  actualIntensity: number;
  targetIntensity: number;
  energyInScope: number; // MJ
  complianceBalance: number; // gCO2eq (positive = surplus, negative = deficit)
}

/**
 * Calculate Compliance Balance
 * CB = (Target - Actual) × Energy in scope
 * Positive CB → Surplus; Negative → Deficit
 */
export function calculateComplianceBalance(
  actualIntensity: number,
  fuelConsumption: number,
  targetIntensity: number = TARGET_INTENSITY_2025
): ComplianceResult {
  const energyInScope = fuelConsumption * MJ_PER_TONNE;
  const complianceBalance = (targetIntensity - actualIntensity) * energyInScope;

  return {
    shipId: '',
    year: 0,
    actualIntensity,
    targetIntensity,
    energyInScope,
    complianceBalance,
  };
}

export function isSurplus(cb: number): boolean {
  return cb > 0;
}

export function isDeficit(cb: number): boolean {
  return cb < 0;
}
