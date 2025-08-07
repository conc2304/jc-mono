import { DesktopIcon, useWindowManager } from '@jc/ui-components';
import { memo, useMemo } from 'react';

export const DesktopIconRenderer = memo(() => {
  const { iconPositions, fileSystemItems, draggedIcon } = useWindowManager();

  const desktopIcons = useMemo(() => {
    return fileSystemItems.filter((item) => !item.parentId);
  }, [fileSystemItems]);

  return (
    <>
      {desktopIcons.map((icon) => {
        const position = iconPositions[icon.id] || { x: 0, y: 0 };
        return (
          <DesktopIcon
            key={icon.id}
            id={icon.id}
            name={icon.name}
            icon={icon.icon}
            position={position}
            isDragging={draggedIcon === icon.id}
          />
        );
      })}
    </>
  );
});

DesktopIconRenderer.displayName = 'DesktopIconRenderer';
