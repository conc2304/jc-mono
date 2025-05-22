import { filterObjectsBySearch, getUniqueValuesByKey } from './arrays.js';

describe('arrays.ts', () => {
  describe('filterObjectsBySearch()', () => {
    const objects = [
      { name: 'John', age: 30 },
      { name: 'Alice', age: 25 },
      { name: 'Bob', age: 35 },
      { name: 'Eve?', age: 40 },
    ];

    it('should return all objects when searchWord is empty', () => {
      expect(filterObjectsBySearch(objects, '')).toEqual(objects);
    });

    it('should return all objects when searchWord is not provided', () => {
      expect(filterObjectsBySearch(objects)).toEqual(objects);
    });

    it('should ignore case sensitivity in search', () => {
      expect(filterObjectsBySearch(objects, 'aLiCe')).toEqual([
        { name: 'Alice', age: 25 },
      ]);
    });

    it('should handle empty search results', () => {
      expect(filterObjectsBySearch(objects, 'xyz')).toEqual([]);
    });

    it('should handle searchWord with special characters', () => {
      expect(filterObjectsBySearch(objects, '?')).toEqual([
        { name: 'Eve?', age: 40 },
      ]);
    });

    it('should handle non-string values in objects', () => {
      const objectsWithNonStringValues = [
        { name: 'John', age: 30 },
        { name: 'Alice', age: 25 },
        { name: 'Bob', age: 35 },
        { name: 'Eve', age: 40 },
        { name: 'David', address: { city: 'New York', country: 'USA' } },
      ];
      expect(
        filterObjectsBySearch(objectsWithNonStringValues, 'new york')
      ).toEqual([
        { name: 'David', address: { city: 'New York', country: 'USA' } },
      ]);
    });
  });

  describe('getUniqueValuesByKey()', () => {
    const objects = [
      { id: 1, name: 'John' },
      { id: 2, name: 'Alice' },
      { id: 3, name: 'Bob' },
      { id: 4, name: 'Alice' },
      { id: 5, name: 'John' },
      { id: 6, name: 'Eve' },
    ];

    it('should return unique values of the specified key', () => {
      expect(getUniqueValuesByKey(objects, 'name')).toEqual([
        'John',
        'Alice',
        'Bob',
        'Eve',
      ]);
    });

    it('should handle empty array of objects', () => {
      expect(getUniqueValuesByKey([], 'name')).toEqual([]);
    });

    it('should handle empty key', () => {
      expect(getUniqueValuesByKey(objects, '' as keyof object)).toEqual([]);
    });

    it('should handle non-existent key', () => {
      expect(getUniqueValuesByKey(objects, 'age' as keyof object)).toEqual([]);
    });

    it('should handle boolean values', () => {
      const objectsWithBooleanValues = [
        { id: 1, active: true },
        { id: 2, active: false },
        { id: 3, active: true },
        { id: 4, active: false },
      ];
      expect(getUniqueValuesByKey(objectsWithBooleanValues, 'active')).toEqual(
        []
      );
    });

    it('should handle non-string or number values', () => {
      const objectsWithNonStringNumberValues = [
        { id: 1, age: 30 },
        { id: 2, age: '25' },
        { id: 3, age: 30 },
        { id: 4, age: true },
        { id: 5, age: null },
        { id: 6, age: 25 },
      ];
      expect(
        getUniqueValuesByKey(objectsWithNonStringNumberValues, 'age')
      ).toEqual([30, '25', 25]);
    });
  });
});
