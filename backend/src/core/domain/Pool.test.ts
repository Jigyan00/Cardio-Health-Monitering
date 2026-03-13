import { 
  canCreatePool, 
  deficitShipExitValid, 
  surplusShipExitValid,
  greedyAllocation,
  validatePoolAllocation
} from '../../core/domain/Pool';

describe('Pool Domain', () => {
  describe('canCreatePool', () => {
    it('should return true when sum of CB >= 0', () => {
      expect(canCreatePool([1000, -500, 500])).toBe(true);
      expect(canCreatePool([0, 0, 0])).toBe(true);
    });

    it('should return false when sum of CB < 0', () => {
      expect(canCreatePool([-1000, -500, 100])).toBe(false);
    });
  });

  describe('deficitShipExitValid', () => {
    it('should return true when deficit ship exits same or better', () => {
      expect(deficitShipExitValid(-1000, -500)).toBe(true);
      expect(deficitShipExitValid(-1000, 0)).toBe(true);
    });

    it('should return false when deficit ship exits worse', () => {
      expect(deficitShipExitValid(-1000, -1500)).toBe(false);
    });

    it('should return true for non-deficit ships', () => {
      expect(deficitShipExitValid(1000, 500)).toBe(true);
    });
  });

  describe('surplusShipExitValid', () => {
    it('should return true when surplus ship exits non-negative', () => {
      expect(surplusShipExitValid(1000, 0)).toBe(true);
      expect(surplusShipExitValid(1000, 500)).toBe(true);
    });

    it('should return false when surplus ship exits negative', () => {
      expect(surplusShipExitValid(1000, -100)).toBe(false);
    });

    it('should return true for non-surplus ships', () => {
      expect(surplusShipExitValid(-1000, -500)).toBe(true);
    });
  });

  describe('greedyAllocation', () => {
    it('should allocate surplus to deficits', () => {
      const members = [
        { shipId: 'A', cb: 1000 },
        { shipId: 'B', cb: -500 },
        { shipId: 'C', cb: 500 },
      ];

      const result = greedyAllocation(members);
      
      // Total surplus = 1500, total deficit = -500
      // After allocation: deficit ship B should be covered
      const shipB = result.find(m => m.shipId === 'B');
      expect(shipB?.cbAfter).toBeGreaterThanOrEqual(shipB?.cbBefore || 0);
    });

    it('should maintain total CB after allocation', () => {
      const members = [
        { shipId: 'A', cb: 2000 },
        { shipId: 'B', cb: -1000 },
      ];

      const result = greedyAllocation(members);
      const totalBefore = members.reduce((sum, m) => sum + m.cb, 0);
      const totalAfter = result.reduce((sum, m) => sum + m.cbAfter, 0);
      
      expect(totalAfter).toBe(totalBefore);
    });
  });

  describe('validatePoolAllocation', () => {
    it('should return true for valid allocation', () => {
      const allocation = [
        { shipId: 'A', cbBefore: 1000, cbAfter: 0 },
        { shipId: 'B', cbBefore: -500, cbAfter: 0 },
      ];

      expect(validatePoolAllocation(allocation)).toBe(true);
    });

    it('should return false when deficit ship exits worse', () => {
      const allocation = [
        { shipId: 'A', cbBefore: 1000, cbAfter: 0 },
        { shipId: 'B', cbBefore: -500, cbAfter: -600 },
      ];

      expect(validatePoolAllocation(allocation)).toBe(false);
    });

    it('should return false when surplus ship exits negative', () => {
      const allocation = [
        { shipId: 'A', cbBefore: 1000, cbAfter: -100 },
        { shipId: 'B', cbBefore: -500, cbAfter: 0 },
      ];

      expect(validatePoolAllocation(allocation)).toBe(false);
    });
  });
});
