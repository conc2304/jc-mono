import React, { createContext, useContext, useEffect, useRef } from 'react';
import { OFControlClient } from './OFControlClient';
import { OFControlStore, globalStore } from './OFControlStore';

interface OFClientContextValue {
  client: OFControlClient;
  store: OFControlStore;
}

const OFClientContext = createContext<OFClientContextValue | null>(null);

export interface OFClientProviderProps {
  wsUrl?: string;
  children: React.ReactNode;
}

export const OFClientProvider: React.FC<OFClientProviderProps> = ({ wsUrl, children }) => {
  const clientRef = useRef<OFControlClient | null>(null);

  // Lazily initialise so the ref is stable across StrictMode double-renders.
  // The effect below owns the connect/disconnect lifecycle.
  if (!clientRef.current) {
    clientRef.current = new OFControlClient(wsUrl);
  }

  useEffect(() => {
    const client = clientRef.current!;
    globalStore.attach(client);
    client.connect();
    return () => {
      client.disconnect();
      // Reset so the next mount (StrictMode re-fire or real remount) gets a
      // fresh socket rather than reusing a destroyed one.
      clientRef.current = new OFControlClient(wsUrl);
      globalStore.detach();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <OFClientContext.Provider value={{ client: clientRef.current, store: globalStore }}>
      {children}
    </OFClientContext.Provider>
  );
};

export const useOFClient = (): OFClientContextValue => {
  const ctx = useContext(OFClientContext);
  if (!ctx) throw new Error('useOFClient must be used within OFClientProvider');
  return ctx;
};
