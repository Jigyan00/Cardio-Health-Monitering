export interface Route {
  id: string;
  routeId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number; // gCO₂e/MJ
  fuelConsumption: number; // tonnes
  distance: number; // km
  totalEmissions: number; // tonnes
  isBaseline: boolean;
}

export interface RouteComparison {
  baseline: Route;
  comparison: Route;
  percentDiff: number;
  compliant: boolean;
}

export const TARGET_INTENSITY_2025 = 89.3368; // gCO₂e/MJ (2% below 91.16)
export const MJ_PER_TONNE = 41000; // Energy conversion factor

export function calculatePercentDiff(comparison: number, baseline: number): number {
  return ((comparison / baseline) - 1) * 100;
}

export function isCompliant(ghgIntensity: number): boolean {
  return ghgIntensity <= TARGET_INTENSITY_2025;
}
