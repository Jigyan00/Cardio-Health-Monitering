import { Route, RouteComparison, RouteFilters } from '../domain/Route';
import { ComplianceResult, AdjustedCB } from '../domain/Compliance';
import { BankEntry, BankingResult } from '../domain/Banking';
import { PoolCreationResult, PoolMember, PoolMemberInput } from '../domain/Pool';

export interface RoutePort {
  getAllRoutes(): Promise<Route[]>;
  filterRoutes(filters: RouteFilters): Promise<Route[]>;
  setBaseline(routeId: string): Promise<Route>;
  getComparison(): Promise<RouteComparison[]>;
}

export interface CompliancePort {
  calculateCB(shipId: string, year: number): Promise<ComplianceResult>;
  getAdjustedCB(shipId: string, year: number): Promise<AdjustedCB>;
}

export interface BankingPort {
  getBankRecords(shipId: string, year: number): Promise<BankEntry[]>;
  bankSurplus(shipId: string, year: number, amount: number): Promise<BankingResult>;
  applyBanked(shipId: string, year: number, amount: number): Promise<BankingResult>;
}

export interface PoolingPort {
  createPool(year: number, members: PoolMemberInput[]): Promise<PoolCreationResult>;
  getPoolMembers(poolId: string): Promise<PoolMember[]>;
}
