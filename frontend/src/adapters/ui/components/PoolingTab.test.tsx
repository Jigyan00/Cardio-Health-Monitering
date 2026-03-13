import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PoolingTab } from './PoolingTab';

// Mock the API
vi.mock('../../../infrastructure/api', () => ({
  poolingApi: {
    createPool: vi.fn().mockResolvedValue({
      pool: { id: 'pool-1', year: 2024, createdAt: new Date().toISOString() },
      members: [
        { poolId: 'pool-1', shipId: 'SHIP1', cbBefore: 1000, cbAfter: 500 },
        { poolId: 'pool-1', shipId: 'SHIP2', cbBefore: -500, cbAfter: 0 },
      ],
      totalCbBefore: 500,
      totalCbAfter: 500,
      isValid: true,
    }),
  },
}));

describe('PoolingTab', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the pooling tab', () => {
    render(<PoolingTab />);
    expect(screen.getByText('Pooling')).toBeInTheDocument();
  });

  it('shows invalid pool when sum is negative', async () => {
    render(<PoolingTab />);
    
    // Change CB to negative values
    const cbInputs = screen.getAllByRole('spinbutton');
    fireEvent.change(cbInputs[0], { target: { value: '-1000' } });
    fireEvent.change(cbInputs[1], { target: { value: '-500' } });
    
    await waitFor(() => {
      expect(screen.getByText('Pool is invalid (Sum must be ≥ 0)')).toBeInTheDocument();
    });
  });

  it('shows valid pool when sum is non-negative', async () => {
    render(<PoolingTab />);
    
    // Change CB to mixed values that sum to positive
    const cbInputs = screen.getAllByRole('spinbutton');
    fireEvent.change(cbInputs[0], { target: { value: '1000' } });
    fireEvent.change(cbInputs[1], { target: { value: '-500' } });
    
    await waitFor(() => {
      expect(screen.getByText('Pool is valid (Sum ≥ 0)')).toBeInTheDocument();
    });
  });

  it('can add members', () => {
    render(<PoolingTab />);
    
    const addButton = screen.getByText('+ Add Member');
    fireEvent.click(addButton);
    
    // Should now have 3 members
    const cbInputs = screen.getAllByRole('spinbutton');
    expect(cbInputs.length).toBe(3);
  });
});
