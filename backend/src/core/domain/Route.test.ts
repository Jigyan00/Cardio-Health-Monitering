import { 
  calculatePercentDiff, 
  isCompliant, 
  TARGET_INTENSITY_2025 
} from '../../core/domain/Route';

describe('Route Domain', () => {
  describe('calculatePercentDiff', () => {
    it('should return 0% when comparison equals baseline', () => {
      const result = calculatePercentDiff(91.0, 91.0);
      expect(result).toBe(0);
    });

    it('should return positive percentage when comparison > baseline', () => {
      const result = calculatePercentDiff(100, 91.0);
      expect(result).toBeCloseTo(9.89, 1);
    });

    it('should return negative percentage when comparison < baseline', () => {
      const result = calculatePercentDiff(80, 91.0);
      expect(result).toBeCloseTo(-12.09, 1);
    });
  });

  describe('isCompliant', () => {
    it('should return true when ghgIntensity <= target', () => {
      expect(isCompliant(89.0)).toBe(true);
      expect(isCompliant(TARGET_INTENSITY_2025)).toBe(true);
    });

    it('should return false when ghgIntensity > target', () => {
      expect(isCompliant(90.0)).toBe(false);
      expect(isCompliant(91.0)).toBe(false);
    });
  });
});
