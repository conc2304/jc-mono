import { alpha, Box } from '@mui/material';

import { FileSystemIcon } from './file-system-icon';
import { useIconDrag, useWindowActions } from '../../context';
import { DesktopIconMetaData } from '../../types';

interface DesktopIconProps extends DesktopIconMetaData {
  position: { x: number; y: number };
  isDragging?: boolean;
}

// TODO - can only have filter or backdrop filter, but not bot
export const DesktopIcon = ({
  id,
  position,
  isDragging = false,
  icon,
  name,
}: DesktopIconProps) => {
  const { handleIconMouseDown } = useIconDrag();
  const { openWindow } = useWindowActions();
  return (
    <Box
      className="DesktopIcon--root"
      sx={{
        position: 'absolute',
        cursor: 'pointer',
        width: (theme) => theme.mixins.desktopIcon.width,
        maxHeight: (theme) => theme.mixins.desktopIcon.maxHeight,
        transition: (theme) =>
          theme.transitions.create(['transform', 'filter'], {
            duration: theme.transitions.duration.standard,
          }),
        transform: isDragging ? 'scale(1.1)' : 'scale(1)',
        filter: ({ palette }) => {
          const blurSize = isDragging ? '4px' : '0px';
          const color =
            palette.mode === 'light'
              ? palette.common.black
              : palette.common.white;

          const [x, y] = !isDragging ? ['0px', '0px'] : ['10px', '10px'];
          return `drop-shadow(${x} ${y} ${blurSize} ${alpha(color, 0.5)})`;
        },
      }}
      style={{
        left: position.x,
        top: position.y,
        zIndex: isDragging ? 10000 : 1,
      }}
      onMouseDown={(e) => handleIconMouseDown(e, id)}
      onDoubleClick={() => openWindow(id)}
    >
      <FileSystemIcon isActive={isDragging} name={name} icon={icon} />
    </Box>
  );
};
