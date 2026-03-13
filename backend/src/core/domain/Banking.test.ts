import { 
  canBank, 
  canApply, 
  calculateBankResult, 
  calculateApplyResult 
} from '../../core/domain/Banking';

describe('Banking Domain', () => {
  describe('canBank', () => {
    it('should return true for positive CB', () => {
      expect(canBank(1000)).toBe(true);
    });

    it('should return false for zero or negative CB', () => {
      expect(canBank(0)).toBe(false);
      expect(canBank(-1000)).toBe(false);
    });
  });

  describe('canApply', () => {
    it('should return true when amount <= available', () => {
      expect(canApply(500, 1000)).toBe(true);
      expect(canApply(1000, 1000)).toBe(true);
    });

    it('should return false when amount > available', () => {
      expect(canApply(1500, 1000)).toBe(false);
    });

    it('should return false for non-positive amount', () => {
      expect(canApply(0, 1000)).toBe(false);
      expect(canApply(-100, 1000)).toBe(false);
    });
  });

  describe('calculateBankResult', () => {
    it('should calculate correct bank result', () => {
      const result = calculateBankResult(10000, 5000);
      
      expect(result.cbBefore).toBe(10000);
      expect(result.applied).toBe(5000);
      expect(result.cbAfter).toBe(5000);
    });
  });

  describe('calculateApplyResult', () => {
    it('should calculate correct apply result', () => {
      const result = calculateApplyResult(-5000, 3000);
      
      expect(result.cbBefore).toBe(-5000);
      expect(result.applied).toBe(3000);
      expect(result.cbAfter).toBe(-2000);
    });
  });
});
