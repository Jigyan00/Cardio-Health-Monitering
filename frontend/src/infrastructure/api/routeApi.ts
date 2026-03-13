import { Route, RouteComparison, RouteFilters } from '../../core/domain/Route';
import { RoutePort } from '../../core/ports';
import { apiClient } from './client';

export class RouteApiAdapter implements RoutePort {
  async getAllRoutes(): Promise<Route[]> {
    return apiClient.get<Route[]>('/routes');
  }

  async filterRoutes(filters: RouteFilters): Promise<Route[]> {
    const params = new URLSearchParams();
    if (filters.vesselType) params.append('vesselType', filters.vesselType);
    if (filters.fuelType) params.append('fuelType', filters.fuelType);
    if (filters.year) params.append('year', filters.year.toString());
    
    const queryString = params.toString();
    return apiClient.get<Route[]>(`/routes${queryString ? `?${queryString}` : ''}`);
  }

  async setBaseline(routeId: string): Promise<Route> {
    return apiClient.post<Route>(`/routes/${routeId}/baseline`);
  }

  async getComparison(): Promise<RouteComparison[]> {
    return apiClient.get<RouteComparison[]>('/routes/comparison');
  }
}

export const routeApi = new RouteApiAdapter();
