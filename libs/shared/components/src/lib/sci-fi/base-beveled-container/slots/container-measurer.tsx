import React from 'react';

import { ContainerContent } from './container-content';
import { BeveledContainerState } from '../../context';

interface ContainerMeasurerProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  className: string;
  rootStyles: React.CSSProperties;
  paddingTop: number;
  paddingBottom: number;
  paddingLeft: number;
  paddingRight: number;
  contentStyles: React.CSSProperties;
  children:
    | React.ReactNode
    | ((state: BeveledContainerState) => React.ReactNode);
  contextValue: BeveledContainerState;
  provideStateToChildren: boolean;
}

export const ContainerMeasurer: React.FC<ContainerMeasurerProps> = ({
  containerRef,
  contentRef,
  className,
  rootStyles,
  paddingTop,
  paddingBottom,
  paddingLeft,
  paddingRight,
  contentStyles,
  children,
  contextValue,
  provideStateToChildren,
}) => (
  <div
    ref={containerRef}
    className={className}
    style={{
      display: 'inline-block',
      position: 'relative',
      ...rootStyles,
    }}
  >
    <div
      ref={contentRef}
      style={{
        visibility: 'hidden',
        position: 'absolute',
        top: 0,
        left: 0,
        padding: `${paddingTop}px ${paddingRight}px ${paddingBottom}px ${paddingLeft}px`,
        whiteSpace: 'nowrap',
        display: 'inline-block',
        ...contentStyles,
      }}
    >
      <ContainerContent
        children={children}
        contextValue={contextValue}
        provideStateToChildren={provideStateToChildren}
        innerRect={{ x: 0, y: 0, width: 0, height: 0 }}
        fillPath=""
        paddingTop={paddingTop}
        paddingBottom={paddingBottom}
        paddingLeft={paddingLeft}
        paddingRight={paddingRight}
        contentStyles={contentStyles}
        isClickable={false}
        contentRef={contentRef}
      />
    </div>
  </div>
);
