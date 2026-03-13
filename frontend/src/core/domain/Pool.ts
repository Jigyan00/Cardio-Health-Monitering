export interface Pool {
  id: string;
  year: number;
  createdAt: string;
}

export interface PoolMember {
  poolId: string;
  shipId: string;
  cbBefore: number;
  cbAfter: number;
}

export interface PoolCreationResult {
  pool: Pool;
  members: PoolMember[];
  totalCbBefore: number;
  totalCbAfter: number;
  isValid: boolean;
}

export interface PoolMemberInput {
  shipId: string;
  cb: number;
}
