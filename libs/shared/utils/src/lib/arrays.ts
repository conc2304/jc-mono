export const filter = <T extends Record<string, unknown>>(
  array: T[],
  props: (keyof T)[],
  search: string
): T[] => {
  if (
    !props ||
    props.length === 0 ||
    !search ||
    search.length === 0 ||
    !array ||
    array.length === 0
  )
    return array;
  return array?.filter((item) =>
    props.some((prop) => {
      const value = item[prop];
      return typeof value === 'string' && value.toLowerCase().includes(search.toLowerCase());
    })
  );
};

export const filterObjectsBySearch = (
  objects: Record<string, unknown>[],
  searchWord = ''
): Record<string, unknown>[] => {
  if (!searchWord || searchWord === '') return objects;

  return objects.filter((obj) => {
    return Object.values(obj).some((value) => {
      if (typeof value === 'object' && value !== null) {
        // If the value is an object and not null, recursively search through it
        return (
          filterObjectsBySearch([value as Record<string, unknown>], searchWord)
            .length > 0
        );
      } else if (typeof value === 'string') {
        // If the value is a string, check if it contains the searchWord (case-insensitive)
        return value.toLowerCase().includes(searchWord.toLowerCase());
      }
      return false;
    });
  });
};

export const getUniqueValuesByKey = <T, K extends keyof T>(
  objects: T[],
  key: K
): Exclude<T[K], boolean>[] => {
  const uniqueValues = new Set<Exclude<T[K], boolean>>();

  for (const obj of objects) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];

      // Check if the value is not a boolean before adding it to uniqueValues
      if (!!value && typeof value !== 'boolean') {
        uniqueValues.add(value as Exclude<T[K], boolean>);
      }
    }
  }

  return Array.from(uniqueValues);
};
