import { v4 as uuidv4 } from 'uuid';
import { Route } from '../../../core/domain/Route';
import { RouteRepository } from '../../../core/ports/outbound/RouteRepository';
import { RouteFilters } from '../../../core/ports/inbound/RouteService';

// Seed data
const seedRoutes: Route[] = [
  {
    id: uuidv4(),
    routeId: 'R001',
    vesselType: 'Container',
    fuelType: 'HFO',
    year: 2024,
    ghgIntensity: 91.0,
    fuelConsumption: 5000,
    distance: 12000,
    totalEmissions: 4500,
    isBaseline: true,
  },
  {
    id: uuidv4(),
    routeId: 'R002',
    vesselType: 'BulkCarrier',
    fuelType: 'LNG',
    year: 2024,
    ghgIntensity: 88.0,
    fuelConsumption: 4800,
    distance: 11500,
    totalEmissions: 4200,
    isBaseline: false,
  },
  {
    id: uuidv4(),
    routeId: 'R003',
    vesselType: 'Tanker',
    fuelType: 'MGO',
    year: 2024,
    ghgIntensity: 93.5,
    fuelConsumption: 5100,
    distance: 12500,
    totalEmissions: 4700,
    isBaseline: false,
  },
  {
    id: uuidv4(),
    routeId: 'R004',
    vesselType: 'RoRo',
    fuelType: 'HFO',
    year: 2025,
    ghgIntensity: 89.2,
    fuelConsumption: 4900,
    distance: 11800,
    totalEmissions: 4300,
    isBaseline: false,
  },
  {
    id: uuidv4(),
    routeId: 'R005',
    vesselType: 'Container',
    fuelType: 'LNG',
    year: 2025,
    ghgIntensity: 90.5,
    fuelConsumption: 4950,
    distance: 11900,
    totalEmissions: 4400,
    isBaseline: false,
  },
];

export class InMemoryRouteRepository implements RouteRepository {
  private routes: Route[] = [...seedRoutes];

  async findAll(): Promise<Route[]> {
    return [...this.routes];
  }

  async findById(id: string): Promise<Route | null> {
    return this.routes.find(r => r.id === id) || null;
  }

  async findByRouteId(routeId: string): Promise<Route | null> {
    return this.routes.find(r => r.routeId === routeId) || null;
  }

  async findBaseline(): Promise<Route | null> {
    return this.routes.find(r => r.isBaseline) || null;
  }

  async updateBaseline(id: string, isBaseline: boolean): Promise<Route> {
    const index = this.routes.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error(`Route ${id} not found`);
    }
    this.routes[index] = { ...this.routes[index], isBaseline };
    return this.routes[index];
  }

  async filter(filters: RouteFilters): Promise<Route[]> {
    return this.routes.filter(r => {
      if (filters.vesselType && r.vesselType !== filters.vesselType) return false;
      if (filters.fuelType && r.fuelType !== filters.fuelType) return false;
      if (filters.year && r.year !== filters.year) return false;
      return true;
    });
  }

  async create(route: Omit<Route, 'id'>): Promise<Route> {
    const newRoute: Route = { ...route, id: uuidv4() };
    this.routes.push(newRoute);
    return newRoute;
  }

  // For testing: reset to seed data
  reset(): void {
    this.routes = [...seedRoutes];
  }
}

// Singleton instance
export const routeRepository = new InMemoryRouteRepository();
