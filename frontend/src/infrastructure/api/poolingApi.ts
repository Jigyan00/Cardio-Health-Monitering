import { PoolCreationResult, PoolMember, PoolMemberInput } from '../../core/domain/Pool';
import { PoolingPort } from '../../core/ports';
import { apiClient } from './client';

export class PoolingApiAdapter implements PoolingPort {
  async createPool(year: number, members: PoolMemberInput[]): Promise<PoolCreationResult> {
    return apiClient.post<PoolCreationResult>('/pools', { year, members });
  }

  async getPoolMembers(poolId: string): Promise<PoolMember[]> {
    return apiClient.get<PoolMember[]>(`/pools/${poolId}/members`);
  }
}

export const poolingApi = new PoolingApiAdapter();
