import { Dispatch, SetStateAction, useCallback, useState } from 'react';

interface UseArrayReturn<T> {
  array: T[];
  set: Dispatch<SetStateAction<T[]>>;
  push: (element: T) => void;
  filter: (callback: (value: T, index: number, array: T[]) => boolean) => void;
  update: (index: number, newElement: T) => void;
  remove: (index: number) => void;
  clear: () => void;
}

export const useArray = <T,>(initialArray: T[]): UseArrayReturn<T> => {
  const [array, setArray] = useState(initialArray);

  const push = useCallback((element: T) => {
    setArray((prev) => [...prev, element]);
  }, []);

  const filter = useCallback(
    (callback: (value: T, index: number, array: T[]) => boolean) => {
      setArray((prev) => prev.filter(callback));
    },
    []
  );

  const update = useCallback((index: number, newElement: T) => {
    setArray((prev) => [
      ...prev.slice(0, index),
      newElement,
      ...prev.slice(index + 1),
    ]);
  }, []);

  const remove = useCallback((index: number) => {
    setArray((prev) => [...prev.slice(0, index), ...prev.slice(index + 1)]);
  }, []);

  const clear = useCallback(() => {
    setArray([]);
  }, []);

  return { array, set: setArray, push, filter, update, remove, clear };
};
