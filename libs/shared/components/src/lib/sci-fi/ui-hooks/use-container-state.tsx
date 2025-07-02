import { useCallback, useState } from 'react';

import { BeveledContainerState } from '../context';

export const useBeveledContainerState = (disabled = false) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const getCurrentState =
    useCallback((): BeveledContainerState['currentState'] => {
      if (disabled) return 'disabled';
      if (isActive) return 'active';
      if (isHovered) return 'hover';
      return 'default';
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
    contextValue: {
      isHovered,
      isActive,
      disabled,
      currentState: getCurrentState(),
    },
  };
};
