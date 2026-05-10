import { useCallback, useRef } from 'react';
import { useOFClient } from './OFClientContext';

const THROTTLE_MS = 40;

export function useSetParam(): (id: string, value: unknown, immediate?: boolean) => void {
  const { client, store } = useOFClient();
  const timerRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const pendingRef = useRef<Record<string, unknown>>({});

  return useCallback((id: string, value: unknown, immediate = false) => {
    store.setValueOptimistic(id, value);
    pendingRef.current[id] = value;

    if (immediate) {
      clearTimeout(timerRef.current[id]);
      delete timerRef.current[id];
      client.send({ type: 'setParam', id, value });
      return;
    }

    if (!timerRef.current[id]) {
      timerRef.current[id] = setTimeout(() => {
        const v = pendingRef.current[id];
        delete timerRef.current[id];
        delete pendingRef.current[id];
        client.send({ type: 'setParam', id, value: v });
      }, THROTTLE_MS);
    }
  }, [client, store]);
}
