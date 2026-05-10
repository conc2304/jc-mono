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

  if (!clientRef.current) {
    clientRef.current = new OFControlClient(wsUrl);
    globalStore.attach(clientRef.current);
  }

  useEffect(() => {
    const client = clientRef.current!;
    client.connect();
    return () => client.disconnect();
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
