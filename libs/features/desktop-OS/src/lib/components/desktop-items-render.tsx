import {
  DesktopIcon,
  useWindowManager,
  useWindowState,
} from '@jc/ui-components';

export const DesktopItemsRenderer = () => {
  const { draggedIcon } = useWindowState();
  const { desktopIcons, iconPositions } = useWindowManager();

  return (
    <>
      {desktopIcons &&
        desktopIcons.map((iconMeta) => (
          <DesktopIcon
            {...iconMeta}
            isDragging={iconMeta.id === draggedIcon}
            position={iconPositions[iconMeta.id]}
            key={iconMeta.id}
          />
        ))}
    </>
  );
};
