import { 
  calculateComplianceBalance, 
  isSurplus, 
  isDeficit,
  TARGET_INTENSITY_2025,
  MJ_PER_TONNE
} from './Compliance';

describe('Compliance Domain', () => {
  describe('calculateComplianceBalance', () => {
    it('should calculate positive CB (surplus) when actual < target', () => {
      const result = calculateComplianceBalance(85.0, 5000, TARGET_INTENSITY_2025);
      
      // CB = (89.3368 - 85.0) * 5000 * 41000 = 4.3368 * 205000000 = 889,044,000
      expect(result.complianceBalance).toBeGreaterThan(0);
      expect(result.energyInScope).toBe(5000 * MJ_PER_TONNE);
    });

    it('should calculate negative CB (deficit) when actual > target', () => {
      const result = calculateComplianceBalance(95.0, 5000, TARGET_INTENSITY_2025);
      
      // CB = (89.3368 - 95.0) * 5000 * 41000 = -5.6632 * 205000000 < 0
      expect(result.complianceBalance).toBeLessThan(0);
    });

    it('should calculate zero CB when actual equals target', () => {
      const result = calculateComplianceBalance(TARGET_INTENSITY_2025, 5000, TARGET_INTENSITY_2025);
      expect(result.complianceBalance).toBe(0);
    });
  });

  describe('isSurplus', () => {
    it('should return true for positive CB', () => {
      expect(isSurplus(1000)).toBe(true);
    });

    it('should return false for zero or negative CB', () => {
      expect(isSurplus(0)).toBe(false);
      expect(isSurplus(-1000)).toBe(false);
    });
  });

  describe('isDeficit', () => {
    it('should return true for negative CB', () => {
      expect(isDeficit(-1000)).toBe(true);
    });

    it('should return false for zero or positive CB', () => {
      expect(isDeficit(0)).toBe(false);
      expect(isDeficit(1000)).toBe(false);
    });
  });
});
