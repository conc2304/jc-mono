interface ContainerContentProps {
  children: React.ReactNode;
  innerRect: { x: number; y: number; width: number; height: number };
  fillPath: string;
  paddingTop: number;
  paddingBottom: number;
  paddingLeft: number;
  paddingRight: number;
  contentStyles: React.CSSProperties;
  isClickable: boolean;
  contentRef: React.RefObject<HTMLDivElement | null>;
  className?: string;
}

export const ContainerContent: React.FC<ContainerContentProps> = ({
  children,
  innerRect,
  fillPath,
  paddingTop,
  paddingBottom,
  paddingLeft,
  paddingRight,
  contentStyles,
  isClickable,
  contentRef,
  className = '',
}) => {
  if (!children) return null;

  return (
    <div
      className={`base-beveled-container--children-wrapper ${className}`}
      ref={contentRef}
      style={{
        // Default styles
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
        className={`base-beveled-container--children-content ${className}__content`}
        style={{
          // Default content styles
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          // Theme content styles override defaults
          ...contentStyles,
        }}
      >
        {children}
      </div>
    </div>
  );
};
