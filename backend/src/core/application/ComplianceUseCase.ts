import { ComplianceResult, calculateComplianceBalance, TARGET_INTENSITY_2025 } from '../domain/Compliance';
import { ComplianceService } from '../ports/inbound/ComplianceService';
import { ComplianceRepository } from '../ports/outbound/ComplianceRepository';
import { RouteRepository } from '../ports/outbound/RouteRepository';
import { BankingRepository } from '../ports/outbound/BankingRepository';

export class ComplianceUseCase implements ComplianceService {
  constructor(
    private readonly complianceRepository: ComplianceRepository,
    private readonly routeRepository: RouteRepository,
    private readonly bankingRepository: BankingRepository
  ) {}

  async calculateCB(shipId: string, year: number): Promise<ComplianceResult> {
    // Get route data for the ship
    const route = await this.routeRepository.findByRouteId(shipId);
    if (!route) {
      throw new Error(`Route/Ship ${shipId} not found`);
    }

    // Calculate compliance balance
    const result = calculateComplianceBalance(
      route.ghgIntensity,
      route.fuelConsumption,
      TARGET_INTENSITY_2025
    );

    // Update result with shipId and year
    result.shipId = shipId;
    result.year = year;

    // Save compliance snapshot
    await this.complianceRepository.save({
      shipId,
      year,
      cbGco2eq: result.complianceBalance,
    });

    return result;
  }

  async getAdjustedCB(shipId: string, year: number): Promise<number> {
    // Get the current CB
    const compliance = await this.complianceRepository.findByShipAndYear(shipId, year);
    if (!compliance) {
      // Calculate if not exists
      const result = await this.calculateCB(shipId, year);
      const bankedAmount = await this.bankingRepository.getTotalBanked(shipId, year);
      return result.complianceBalance + bankedAmount;
    }

    // Get banked adjustments
    const bankedAmount = await this.bankingRepository.getTotalBanked(shipId, year);
    return compliance.cbGco2eq + bankedAmount;
  }
}
