// Memoized Window component to prevent unnecessary re-renders
export const OptimizedWindow = React.memo(
  ({
    window,
    onMouseDown,
  }: {
    window: WindowMetaData;
    onMouseDown: (e: React.MouseEvent, id: string) => void;
  }) => {
    return (
      <div
        data-window-id={window.id}
        style={{
          position: 'absolute',
          left: window.x,
          top: window.y,
          width: window.width,
          height: window.height,
          zIndex: window.zIndex,
          // Use transform for better performance
          willChange: 'transform',
        }}
        onMouseDown={(e) => onMouseDown(e, window.id)}
      >
        <div className="title-bar">{window.title}</div>
        <div className="content">{window.windowContent}</div>
      </div>
    );
  }
);
