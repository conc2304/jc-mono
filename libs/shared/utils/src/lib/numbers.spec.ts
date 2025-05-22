import { roundNumToNearestX, truncateToDecimalPlace } from './numbers.js';

describe('Number Utility Functions', () => {
  describe('roundNumToNearestX', () => {
    it('should round a number to the nearest X', () => {
      expect(roundNumToNearestX(7.32, 0.05)).toBe(7.3);
      expect(roundNumToNearestX(7.37, 0.05)).toBe(7.35);
      expect(roundNumToNearestX(10, 2)).toBe(10);
      expect(roundNumToNearestX(12.34, 0.1)).toBe(12.3);
    });
  });

  describe('truncateToDecimalPlace', () => {
    it('should truncate a number to the specified decimal places', () => {
      expect(truncateToDecimalPlace(12.3456789, 2)).toBe(12.34);
      expect(truncateToDecimalPlace(3.14159, 3)).toBe(3.141);
      expect(truncateToDecimalPlace(12345.6789, 0)).toBe(12345);
      expect(truncateToDecimalPlace(0.987654321, 5)).toBe(0.98765);
    });
  });
});
