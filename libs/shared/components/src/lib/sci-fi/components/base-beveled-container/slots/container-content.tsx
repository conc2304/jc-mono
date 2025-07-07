'use client';

import React from 'react';

interface ContainerContentProps {
  children: React.ReactNode;
  innerRect: { x: number; y: number; width: number; height: number };
  fillPath: string;
  paddingTop: number;
  paddingBottom: number;
  paddingLeft: number;
  paddingRight: number;
  style: React.CSSProperties;
  isClickable: boolean;
  contentRef: React.RefObject<HTMLDivElement | null>;
}

export const ContainerContent: React.FC<ContainerContentProps> = ({
  children,
  innerRect,
  fillPath,
  paddingTop,
  paddingBottom,
  paddingLeft,
  paddingRight,
  style,
  isClickable,
  contentRef,
}) => {
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
          ...style,
        }}
      >
        {children}
      </div>
    </div>
  );
};
