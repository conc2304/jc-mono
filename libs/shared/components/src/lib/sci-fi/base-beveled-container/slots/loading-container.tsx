import React from 'react';

import { BeveledContainerContext, BeveledContainerState } from '../../context';

interface LoadingContainerProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  className: string;
  padding: {
    paddingTop: number;
    paddingBottom: number;
    paddingLeft: number;
    paddingRight: number;
  };
  styles: {
    root: React.CSSProperties;
    content: React.CSSProperties;
  };
  handlers: {
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onMouseDown: () => void;
    onMouseUp: () => void;
  };
  children:
    | React.ReactNode
    | ((state: BeveledContainerState) => React.ReactNode);
  contextValue: BeveledContainerState;
  provideStateToChildren: boolean;
}

export const LoadingContainer: React.FC<LoadingContainerProps> = ({
  containerRef,
  contentRef,
  className,
  padding,
  styles,
  handlers,
  children,
  contextValue,
  provideStateToChildren,
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

  return (
    <div
      ref={containerRef}
      className={className}
      {...handlers}
      style={{
        display: 'inline-block',
        position: 'relative',
        ...styles.root,
      }}
    >
      <div
        ref={contentRef}
        style={{
          visibility: 'hidden',
          position: 'absolute',
          top: 0,
          left: 0,
          padding: `${padding.paddingTop}px ${padding.paddingRight}px ${padding.paddingBottom}px ${padding.paddingLeft}px`,
          whiteSpace: 'nowrap',
          display: 'inline-block',
          ...styles.content,
        }}
      >
        {renderChildren()}
      </div>
    </div>
  );
};
