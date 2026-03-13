import { Route } from '../../domain/Route';
import { RouteFilters } from '../inbound/RouteService';

export interface RouteRepository {
  findAll(): Promise<Route[]>;
  findById(id: string): Promise<Route | null>;
  findByRouteId(routeId: string): Promise<Route | null>;
  findBaseline(): Promise<Route | null>;
  updateBaseline(id: string, isBaseline: boolean): Promise<Route>;
  filter(filters: RouteFilters): Promise<Route[]>;
  create(route: Omit<Route, 'id'>): Promise<Route>;
}
