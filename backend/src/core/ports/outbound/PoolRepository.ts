import { Pool, PoolMember } from '../../domain/Pool';

export interface PoolRepository {
  create(pool: Omit<Pool, 'id' | 'createdAt'>): Promise<Pool>;
  addMembers(poolId: string, members: Omit<PoolMember, 'poolId'>[]): Promise<PoolMember[]>;
  findById(id: string): Promise<Pool | null>;
  findMembersByPoolId(poolId: string): Promise<PoolMember[]>;
}
