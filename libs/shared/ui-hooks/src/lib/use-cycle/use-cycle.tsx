import { useState } from 'react';

export interface UseCycleReturn<T> {
  current: T;
  cycle: () => void;
}

export const useCycle = <T,>(...args: T[]) => {
  const [index, setIndex] = useState(0);

  const cycle = () => {
    setIndex((index) => (index + 1) % args.length);
  };

  return [args[index], cycle];
};
