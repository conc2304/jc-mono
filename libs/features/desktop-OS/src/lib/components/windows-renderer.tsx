import { memo } from 'react';
import { Window } from '@jc/ui-components';

import { useOptimizedDragSystem } from '../hooks';

export const WindowsRenderer = memo(() => {
  const { windows } = useOptimizedDragSystem();

  return (
    <>
      {windows.map((window) => (
        <Window key={window.id} {...window} />
      ))}
    </>
  );
});

WindowsRenderer.displayName = 'WindowRenderer';
