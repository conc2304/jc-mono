import { useState, useCallback } from 'react';

export const useContainerState = (disabled: boolean) => {
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
