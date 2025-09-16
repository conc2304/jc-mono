import React, { createContext, useContext, ReactNode } from 'react';
import { MediaContextSize, MediaProviderType } from './types';

interface MediaContextType {
  provider: MediaProviderType;
  defaultContext: MediaContextSize;
}

const MediaContext = createContext<MediaContextType | null>(null);

interface MediaProviderProps {
  provider: MediaProviderType;
  defaultContext?: MediaContextSize;
  children: ReactNode;
}

export const MediaProvider: React.FC<MediaProviderProps> = ({
  provider,
  defaultContext = 'gallery',
  children,
}) => {
  return (
    <MediaContext.Provider value={{ provider, defaultContext }}>
      {children}
    </MediaContext.Provider>
  );
};

export const useMediaProvider = () => {
  const context = useContext(MediaContext);
  if (!context) {
    throw new Error(
      'useMediaProvider must be used within a MediaProviderComponent'
    );
  }
  return context;
};
