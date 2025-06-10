import React from 'react';

import { BeveledContainerContext, BeveledContainerState } from '../../context';
import { StateStyles } from '../../types';

interface ContainerContentProps {
  children:
    | React.ReactNode
    | ((state: BeveledContainerState) => React.ReactNode);
  contextValue: BeveledContainerState;
  provideStateToChildren: boolean;
  innerRect: { x: number; y: number; width: number; height: number };
  fillPath: string;
  paddingTop: number;
  paddingBottom: number;
  paddingLeft: number;
  paddingRight: number;
  contentStyles: React.CSSProperties;
  isClickable: boolean;
  contentRef: React.RefObject<HTMLDivElement | null>;
}

export const ContainerContent: React.FC<ContainerContentProps> = ({
  children,
  contextValue,
  provideStateToChildren,
  innerRect,
  fillPath,
  paddingTop,
  paddingBottom,
  paddingLeft,
  paddingRight,
  contentStyles,
  isClickable,
  contentRef,
}) => {
  const renderChildren = () => {
    if (typeof children === 'function') {
      return children(contextValue);
    }

    if (provideStateToChildren) {
      return (
        <BeveledContainerContext.Provider value={contextValue}>
          {children}
        </BeveledContainerContext.Provider>
      );
    }

    return children;
  };

  if (!children) return null;

  return (
    <div
      className="base-beveled-container--children-wrapper"
      ref={contentRef}
      style={{
        position: 'absolute',
        top: innerRect.y,
        left: innerRect.x,
        zIndex: 3,
        padding: `${paddingTop}px ${paddingRight}px ${paddingBottom}px ${paddingLeft}px`,
        boxSizing: 'border-box',
        clipPath: `path('${fillPath}')`,
        pointerEvents: isClickable ? 'none' : 'auto',
      }}
    >
      <div
        className="base-beveled-container--children-content"
        style={{
          ...contentStyles,
        }}
      >
        {renderChildren()}
      </div>
    </div>
  );
};
