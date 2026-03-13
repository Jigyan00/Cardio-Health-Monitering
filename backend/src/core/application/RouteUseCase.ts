import { Route, RouteComparison, calculatePercentDiff, isCompliant } from '../domain/Route';
import { RouteService, RouteFilters } from '../ports/inbound/RouteService';
import { RouteRepository } from '../ports/outbound/RouteRepository';

export class RouteUseCase implements RouteService {
  constructor(private readonly routeRepository: RouteRepository) {}

  async getAllRoutes(): Promise<Route[]> {
    return this.routeRepository.findAll();
  }

  async getRouteById(id: string): Promise<Route | null> {
    return this.routeRepository.findById(id);
  }

  async setBaseline(routeId: string): Promise<Route> {
    // First, clear any existing baseline
    const currentBaseline = await this.routeRepository.findBaseline();
    if (currentBaseline) {
      await this.routeRepository.updateBaseline(currentBaseline.id, false);
    }

    // Find route by routeId and set as baseline
    const route = await this.routeRepository.findByRouteId(routeId);
    if (!route) {
      throw new Error(`Route with routeId ${routeId} not found`);
    }

    return this.routeRepository.updateBaseline(route.id, true);
  }

  async getComparison(): Promise<RouteComparison[]> {
    const baseline = await this.routeRepository.findBaseline();
    if (!baseline) {
      throw new Error('No baseline route set');
    }

    const allRoutes = await this.routeRepository.findAll();
    const comparisons: RouteComparison[] = [];

    for (const route of allRoutes) {
      if (route.id !== baseline.id) {
        const percentDiff = calculatePercentDiff(route.ghgIntensity, baseline.ghgIntensity);
        comparisons.push({
          baseline,
          comparison: route,
          percentDiff,
          compliant: isCompliant(route.ghgIntensity),
        });
      }
    }

    return comparisons;
  }

  async filterRoutes(filters: RouteFilters): Promise<Route[]> {
    return this.routeRepository.filter(filters);
  }
}
