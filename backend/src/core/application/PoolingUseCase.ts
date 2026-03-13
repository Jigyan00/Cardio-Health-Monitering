import { PoolCreationResult, PoolMember, canCreatePool, greedyAllocation, validatePoolAllocation } from '../domain/Pool';
import { PoolingService } from '../ports/inbound/PoolingService';
import { PoolRepository } from '../ports/outbound/PoolRepository';

export class PoolingUseCase implements PoolingService {
  constructor(private readonly poolRepository: PoolRepository) {}

  async createPool(
    year: number,
    members: Array<{ shipId: string; cb: number }>
  ): Promise<PoolCreationResult> {
    // Validate sum of CB >= 0
    const cbValues = members.map(m => m.cb);
    if (!canCreatePool(cbValues)) {
      throw new Error('Cannot create pool: Sum of CB must be >= 0');
    }

    // Calculate allocation using greedy algorithm
    const allocation = greedyAllocation(members);

    // Validate all exit conditions
    if (!validatePoolAllocation(allocation)) {
      throw new Error('Pool allocation violates exit conditions');
    }

    // Calculate totals
    const totalCbBefore = members.reduce((sum, m) => sum + m.cb, 0);
    const totalCbAfter = allocation.reduce((sum, m) => sum + m.cbAfter, 0);

    // Create pool
    const pool = await this.poolRepository.create({ year });

    // Add members
    const poolMembers = await this.poolRepository.addMembers(
      pool.id,
      allocation.map(a => ({
        shipId: a.shipId,
        cbBefore: a.cbBefore,
        cbAfter: a.cbAfter,
      }))
    );

    return {
      pool,
      members: poolMembers,
      totalCbBefore,
      totalCbAfter,
      isValid: true,
    };
  }

  async getPoolMembers(poolId: string): Promise<PoolMember[]> {
    return this.poolRepository.findMembersByPoolId(poolId);
  }
}
