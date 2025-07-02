import { getMinPadding } from '../utils';

export const MeasuringContainer: React.FC<{
  containerRef: React.RefObject<HTMLDivElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  className: string;
  padding: ReturnType<typeof getMinPadding>;
  contentStyles: React.CSSProperties;
  children: React.ReactNode;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onMouseDown: () => void;
  onMouseUp: () => void;
  rootStyles: React.CSSProperties;
}> = ({
  containerRef,
  contentRef,
  className,
  padding,
  contentStyles,
  children,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
  rootStyles,
}) => (
  <div
    ref={containerRef}
    className={className}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    onMouseDown={onMouseDown}
    onMouseUp={onMouseUp}
    style={{
      display: 'inline-block',
      position: 'relative',
      ...rootStyles,
    }}
  >
    <div
      ref={contentRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        padding: `${padding.paddingTop}px ${padding.paddingRight}px ${padding.paddingBottom}px ${padding.paddingLeft}px`,
        whiteSpace: 'nowrap',
        display: 'inline-block',
        ...contentStyles,
      }}
    >
      {children}
    </div>
  </div>
);
