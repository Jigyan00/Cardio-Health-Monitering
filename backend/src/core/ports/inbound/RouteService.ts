import { Route, RouteComparison } from '../../domain/Route';

export interface RouteService {
  getAllRoutes(): Promise<Route[]>;
  getRouteById(id: string): Promise<Route | null>;
  setBaseline(routeId: string): Promise<Route>;
  getComparison(): Promise<RouteComparison[]>;
  filterRoutes(filters: RouteFilters): Promise<Route[]>;
}

export interface RouteFilters {
  vesselType?: string;
  fuelType?: string;
  year?: number;
}
