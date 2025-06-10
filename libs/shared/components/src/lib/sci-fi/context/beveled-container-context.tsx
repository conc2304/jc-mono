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

export const useBeveledContainerState = (
  disabled: boolean | undefined = undefined
) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const getCurrentState = useCallback(() => {
    if (disabled) return 'disabled' as const;
    if (isActive) return 'active' as const;
    if (isHovered) return 'hover' as const;
    return 'default' as const;
  }, [disabled, isActive, isHovered]);

  const handlers = {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
    onMouseDown: () => setIsActive(true),
    onMouseUp: () => setIsActive(false),
  };

  return {
    isHovered,
    isActive,
    currentState: getCurrentState(),
    handlers,
  };
};

// Helper hook for children to get state-based styles
export const useBeveledContainerStyles = (styles: StateStyles) => {
  const { currentState } = useBeveledContainerState();

  return {
    ...styles.default,
    ...(styles[currentState] || {}),
  };
};
