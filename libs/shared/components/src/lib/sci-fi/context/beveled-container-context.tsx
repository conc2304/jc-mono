'use client';

import { useContext, createContext, useState, useCallback } from 'react';

import { StateStyles } from '../types';

export interface BeveledContainerState {
  isHovered: boolean;
  isActive: boolean;
  disabled: boolean;
  currentState: 'default' | 'hover' | 'active' | 'disabled';
}

export const BeveledContainerContext =
  createContext<BeveledContainerState | null>(null);

// // Hook for children to access the container's state
// export const useBeveledContainerState = () => {
//   const context = useContext(BeveledContainerContext);
//   if (!context) {
//     throw new Error(
//       'useBeveledContainerState must be used within a BaseBeveledContainer'
//     );
//   }
//   return context;
// };

export const useContainerState = (disabled = false) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const currentState: BeveledContainerState['currentState'] = (() => {
    if (disabled) return 'disabled';
    if (isActive) return 'active';
    if (isHovered) return 'hover';
    return 'default';
  })();

  return {
    isHovered,
    setIsHovered,
    isActive,
    setIsActive,
    currentState,
  };
};

// Helper hook for children to get state-based styles
export const useBeveledContainerStyles = (styles: StateStyles) => {
  const { currentState } = useContainerState();

  return {
    ...styles.default,
    ...(styles[currentState] || {}),
  };
};
