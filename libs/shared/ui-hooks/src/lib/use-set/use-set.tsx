import { useCallback, useState } from 'react';

export interface UseSetReturn<T> {
  set: Readonly<Set<T>>;
  add: (key: T) => void;
  remove: (key: T) => void;
  toggle: (key: T) => void;
  reset: () => void;
  clear: () => void;
}
export const useSet = <T,>(initialSet: Set<T>): UseSetReturn<T> => {
  const [set, setSet] = useState(initialSet);

  const add = useCallback((value: T) => {
    setSet((prev) => new Set([...prev, value]));
  }, []);

  const remove = useCallback((value: T) => {
    setSet((prev) => new Set([...prev].filter((v) => v !== value)));
  }, []);

  const toggle = useCallback((value: T) => {
    setSet(
      (prev) =>
        new Set(
          [...prev].includes(value)
            ? new Set([...prev].filter((v) => v !== value))
            : new Set([...prev, value])
        )
    );
  }, []);

  const reset = useCallback(() => {
    setSet(initialSet);
  }, [initialSet]);

  const clear = useCallback(() => {
    setSet(new Set());
  }, []);

  return { set, add, remove, toggle, reset, clear };
};
