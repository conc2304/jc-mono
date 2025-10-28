import React from 'react';
import { alpha, Box } from '@mui/material';

import { FileSystemIcon } from './file-system-icon';
import { useIconDrag, useWindowActions } from '../../context';
import { DesktopItemMetaData, ItemPosition } from '../../types';

interface DesktopIconProps extends DesktopItemMetaData {
  position: ItemPosition;
  isDragging?: boolean;
}

// Memoized component to prevent unnecessary re-renders
export const DesktopIcon = React.memo<DesktopIconProps>(
  ({ id, position, isDragging = false, icon, name }) => {
    const { handleIconMouseDown, draggedIcon } = useIconDrag();
    const { openWindow } = useWindowActions();

    // Check if this specific icon is being dragged
    const isThisIconDragging = draggedIcon === id;
    // Use prop for external drag state or internal state for performance
    const effectiveIsDragging = isDragging || isThisIconDragging;

    return (
      <Box
        className="DesktopIcon--root"
        data-icon-id={id} // Required for optimized drag system
        sx={(theme) => ({
          position: 'absolute',
          cursor: 'pointer',
          // Performance optimizations
          contain: 'layout style paint',
          willChange: effectiveIsDragging ? 'transform' : 'auto',

          // Conditional transitions - disable during drag for performance
          transition: !effectiveIsDragging
            ? theme.transitions.create(['filter'], {
                duration: theme.transitions.duration.standard,
              })
            : 'none',

          transform: effectiveIsDragging ? 'scale(1.1)' : 'scale(1)',
          filter: ({ palette }) => {
            const blurSize = effectiveIsDragging ? '4px' : '0px';
            const color =
              palette.mode === 'light'
                ? palette.common.black
                : palette.common.white;

            const [x, y] = !effectiveIsDragging
              ? ['0px', '0px']
              : ['10px', '10px'];

            return `drop-shadow(${x} ${y} ${blurSize} ${alpha(color, 0.5)})`;
          },

          // Enhanced hover effects when not dragging
          '&:hover': !effectiveIsDragging
            ? {
                transform: 'scale(1.05)',
                filter: `drop-shadow(2px 2px 2px ${alpha(
                  theme.palette.mode === 'light'
                    ? theme.palette.common.black
                    : theme.palette.common.white,
                  0.3
                )})`,
              }
            : {},

          // Focus styles for accessibility
          '&:focus-visible': {
            outline: `2px solid ${theme.palette.primary.main}`,
            outlineOffset: '2px',
          },
        })}
        style={{
          left: position.x,
          top: position.y,
          zIndex: effectiveIsDragging ? 10000 : 1,
        }}
        onMouseDown={(e) => handleIconMouseDown(e, id)}
        onDoubleClick={() => openWindow(id)}
        onTouchEnd={() => openWindow(id)}
        // Add keyboard support for accessibility
        tabIndex={0}
        role="button"
        aria-label={`${name} icon`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openWindow(id);
          }
        }}
      >
        <FileSystemIcon
          isActive={effectiveIsDragging}
          name={name}
          icon={icon}
        />
      </Box>
    );
  }
);

DesktopIcon.displayName = 'DesktopIcon';
