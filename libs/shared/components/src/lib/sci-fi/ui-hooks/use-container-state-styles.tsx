import { useMemo } from 'react';

import { StateStyles, ElementStyleConfig } from '../types';

type StateType = 'default' | 'hover' | 'active' | 'disabled';

export const useStyleCalculator = (
  styleConfig: ElementStyleConfig,
  currentState: StateType
) => {
  return useMemo(() => {
    const calculateStyles = (elementStyles: StateStyles = {}) => {
      const baseStyles = elementStyles.default || {};
      const stateStyles = elementStyles[currentState] || {};
      return { ...baseStyles, ...stateStyles };
    };

    return {
      root: calculateStyles(styleConfig.root),
      background: calculateStyles(styleConfig.background),
      shadow: calculateStyles(styleConfig.shadow),
      border: calculateStyles(styleConfig.border),
      content: calculateStyles(styleConfig.content),
    };
  }, [styleConfig, currentState]);
};
