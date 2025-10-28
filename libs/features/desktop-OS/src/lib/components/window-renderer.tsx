import { useWindowManager, Window } from '@jc/file-system';
import { memo } from 'react';

export const WindowRenderer = memo(() => {
  const { windows } = useWindowManager();

  return (
    <>
      {windows.map((window) => (
        <Window key={window.id} {...window} isActive={window.isActive} />
      ))}
    </>
  );
});
WindowRenderer.displayName = 'WindowRenderer';
