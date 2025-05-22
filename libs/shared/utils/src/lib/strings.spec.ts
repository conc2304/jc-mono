import { hashString } from './strings.js';

describe('string.ts', () => {
  describe('hashString', () => {
    it('should repeatedly hash a string correctly', () => {
      const input = 'hello world';
      const expectedHash = 1794106052; // Replace with the expected hash value for 'hello world'

      // it sure always return the same value for the hash map
      expect(hashString(input)).toEqual(expectedHash);
      expect(hashString(input)).toEqual(expectedHash);
      expect(hashString(input)).toEqual(expectedHash);
      expect(hashString(input)).toEqual(expectedHash);
    });

    it('should handle an empty string', () => {
      const input = '';
      const expectedHash = 0; // The hash of an empty string is typically 0

      const result = hashString(input);

      expect(result).toEqual(expectedHash);
    });
  });
});
