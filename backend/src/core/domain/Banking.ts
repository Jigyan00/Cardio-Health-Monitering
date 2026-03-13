export interface BankEntry {
  id: string;
  shipId: string;
  year: number;
  amountGco2eq: number;
  createdAt: Date;
}

export interface BankingResult {
  cbBefore: number;
  applied: number;
  cbAfter: number;
}

/**
 * Validates that banking amount is valid
 * Only positive CB can be banked
 */
export function canBank(cb: number): boolean {
  return cb > 0;
}

/**
 * Validates that apply amount is valid
 * Cannot apply more than available banked amount
 */
export function canApply(amount: number, availableBanked: number): boolean {
  return amount > 0 && amount <= availableBanked;
}

/**
 * Calculate result after banking
 */
export function calculateBankResult(cbBefore: number, amountToBanked: number): BankingResult {
  return {
    cbBefore,
    applied: amountToBanked,
    cbAfter: cbBefore - amountToBanked, // Surplus moved to bank
  };
}

/**
 * Calculate result after applying banked surplus
 */
export function calculateApplyResult(cbBefore: number, amountApplied: number): BankingResult {
  return {
    cbBefore,
    applied: amountApplied,
    cbAfter: cbBefore + amountApplied, // Deficit reduced
  };
}
