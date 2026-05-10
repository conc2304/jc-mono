import { useEffect, useState } from 'react';
import type { OFControlStore } from './OFControlStore';
import { useOFClient } from './OFClientContext';

export function useOFStore(): OFControlStore {
  const { store } = useOFClient();
  const [, setTick] = useState(0);

  useEffect(() => {
    return store.subscribe(() => setTick((t) => t + 1));
  }, [store]);

  return store;
}
