import { v4 as uuidv4 } from 'uuid';
import { Pool, PoolMember } from '../../../core/domain/Pool';
import { PoolRepository } from '../../../core/ports/outbound/PoolRepository';

export class InMemoryPoolRepository implements PoolRepository {
  private pools: Pool[] = [];
  private members: PoolMember[] = [];

  async create(pool: Omit<Pool, 'id' | 'createdAt'>): Promise<Pool> {
    const newPool: Pool = {
      ...pool,
      id: uuidv4(),
      createdAt: new Date(),
    };
    this.pools.push(newPool);
    return newPool;
  }

  async addMembers(
    poolId: string,
    members: Omit<PoolMember, 'poolId'>[]
  ): Promise<PoolMember[]> {
    const newMembers: PoolMember[] = members.map(m => ({
      ...m,
      poolId,
    }));
    this.members.push(...newMembers);
    return newMembers;
  }

  async findById(id: string): Promise<Pool | null> {
    return this.pools.find(p => p.id === id) || null;
  }

  async findMembersByPoolId(poolId: string): Promise<PoolMember[]> {
    return this.members.filter(m => m.poolId === poolId);
  }

  // For testing: clear all data
  clear(): void {
    this.pools = [];
    this.members = [];
  }
}

// Singleton instance
export const poolRepository = new InMemoryPoolRepository();
