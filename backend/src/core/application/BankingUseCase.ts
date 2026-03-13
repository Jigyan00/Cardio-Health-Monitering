import { BankEntry, BankingResult, canBank, canApply, calculateBankResult, calculateApplyResult } from '../domain/Banking';
import { BankingService } from '../ports/inbound/BankingService';
import { BankingRepository } from '../ports/outbound/BankingRepository';
import { ComplianceRepository } from '../ports/outbound/ComplianceRepository';

export class BankingUseCase implements BankingService {
  constructor(
    private readonly bankingRepository: BankingRepository,
    private readonly complianceRepository: ComplianceRepository
  ) {}

  async getBankRecords(shipId: string, year: number): Promise<BankEntry[]> {
    return this.bankingRepository.findByShipAndYear(shipId, year);
  }

  async bankSurplus(shipId: string, year: number, amount: number): Promise<BankingResult> {
    // Get current CB
    const compliance = await this.complianceRepository.findByShipAndYear(shipId, year);
    if (!compliance) {
      throw new Error(`No compliance record found for ship ${shipId} year ${year}`);
    }

    const currentCB = compliance.cbGco2eq;

    // Validate can bank
    if (!canBank(currentCB)) {
      throw new Error('Cannot bank: Compliance Balance is not positive');
    }

    if (amount > currentCB) {
      throw new Error(`Cannot bank ${amount}: only ${currentCB} available`);
    }

    // Save bank entry
    await this.bankingRepository.save({
      shipId,
      year,
      amountGco2eq: amount,
    });

    return calculateBankResult(currentCB, amount);
  }

  async applyBanked(shipId: string, year: number, amount: number): Promise<BankingResult> {
    // Get current CB
    const compliance = await this.complianceRepository.findByShipAndYear(shipId, year);
    if (!compliance) {
      throw new Error(`No compliance record found for ship ${shipId} year ${year}`);
    }

    const currentCB = compliance.cbGco2eq;

    // Get available banked amount
    const availableBanked = await this.getAvailableBanked(shipId, year);

    // Validate can apply
    if (!canApply(amount, availableBanked)) {
      throw new Error(`Cannot apply ${amount}: only ${availableBanked} banked available`);
    }

    // Save negative bank entry to track usage
    await this.bankingRepository.save({
      shipId,
      year,
      amountGco2eq: -amount, // Negative to indicate usage
    });

    return calculateApplyResult(currentCB, amount);
  }

  async getAvailableBanked(shipId: string, year: number): Promise<number> {
    return this.bankingRepository.getTotalBanked(shipId, year);
  }
}
