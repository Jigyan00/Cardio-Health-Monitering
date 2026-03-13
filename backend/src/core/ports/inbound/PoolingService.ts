import { PoolCreationResult, PoolMember } from '../../domain/Pool';

export interface PoolingService {
  createPool(
    year: number,
    members: Array<{ shipId: string; cb: number }>
  ): Promise<PoolCreationResult>;
  getPoolMembers(poolId: string): Promise<PoolMember[]>;
}
