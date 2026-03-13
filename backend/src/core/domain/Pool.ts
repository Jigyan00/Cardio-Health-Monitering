export interface Pool {
  id: string;
  year: number;
  createdAt: Date;
}

export interface PoolMember {
  poolId: string;
  shipId: string;
  cbBefore: number;
  cbAfter: number;
}

export interface PoolCreationResult {
  pool: Pool;
  members: PoolMember[];
  totalCbBefore: number;
  totalCbAfter: number;
  isValid: boolean;
}

/**
 * Validates pool can be created
 * Rule: Sum(adjustedCB) >= 0
 */
export function canCreatePool(membersCb: number[]): boolean {
  const sum = membersCb.reduce((a, b) => a + b, 0);
  return sum >= 0;
}

/**
 * Validates deficit ship exit condition
 * Rule: Deficit ship cannot exit worse than before
 */
export function deficitShipExitValid(cbBefore: number, cbAfter: number): boolean {
  if (cbBefore < 0) {
    return cbAfter >= cbBefore;
  }
  return true;
}

/**
 * Validates surplus ship exit condition
 * Rule: Surplus ship cannot exit negative
 */
export function surplusShipExitValid(cbBefore: number, cbAfter: number): boolean {
  if (cbBefore > 0) {
    return cbAfter >= 0;
  }
  return true;
}

/**
 * Greedy allocation algorithm:
 * 1. Sort members desc by CB
 * 2. Transfer surplus to deficits
 */
export function greedyAllocation(
  members: Array<{ shipId: string; cb: number }>
): Array<{ shipId: string; cbBefore: number; cbAfter: number }> {
  // Sort by CB descending (surplus first)
  const sorted = [...members].sort((a, b) => b.cb - a.cb);
  
  const result = sorted.map(m => ({
    shipId: m.shipId,
    cbBefore: m.cb,
    cbAfter: m.cb,
  }));

  // Find surplus ships and deficit ships
  let availableSurplus = 0;
  for (const m of result) {
    if (m.cbAfter > 0) {
      availableSurplus += m.cbAfter;
    }
  }

  // Allocate surplus to deficits
  for (const m of result) {
    if (m.cbAfter < 0 && availableSurplus > 0) {
      const deficit = Math.abs(m.cbAfter);
      const transfer = Math.min(deficit, availableSurplus);
      m.cbAfter += transfer;
      availableSurplus -= transfer;
    }
  }

  // Reduce surplus from surplus ships
  let surplusUsed = members.filter(m => m.cb > 0).reduce((a, b) => a + b.cb, 0) - availableSurplus;
  for (const m of result) {
    if (m.cbBefore > 0 && surplusUsed > 0) {
      const maxReduction = m.cbBefore;
      const reduction = Math.min(maxReduction, surplusUsed);
      m.cbAfter = m.cbBefore - reduction;
      surplusUsed -= reduction;
    }
  }

  return result;
}

/**
 * Validate all pool members exit conditions
 */
export function validatePoolAllocation(
  allocation: Array<{ shipId: string; cbBefore: number; cbAfter: number }>
): boolean {
  for (const m of allocation) {
    if (!deficitShipExitValid(m.cbBefore, m.cbAfter)) {
      return false;
    }
    if (!surplusShipExitValid(m.cbBefore, m.cbAfter)) {
      return false;
    }
  }
  return true;
}
