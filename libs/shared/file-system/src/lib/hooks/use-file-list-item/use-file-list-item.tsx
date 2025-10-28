import {
  CSSProperties,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { ScrollAwareClickConfig, useScrollAwareClick } from '@jc/ui-components';

import { BaseFileSystemItem } from '../../types';

export const useFileSystemItem = (
  item: BaseFileSystemItem,
  handlers: {
    onItemClick: (item: BaseFileSystemItem, e: React.MouseEvent) => void;
    onItemDoubleClick: (
      item: BaseFileSystemItem,
      e: React.MouseEvent | React.TouchEvent
    ) => void;
    onDragStart?: (item: BaseFileSystemItem) => void;
    onDragOver?: (item: BaseFileSystemItem, e: React.DragEvent) => void;
    onDrop?: (item: BaseFileSystemItem, e: React.DragEvent) => void;
  },
  viewConfig?: Partial<ScrollAwareClickConfig>
) => {
  const context = useContext(FileSystemContext);
  const [clickTimeout, setClickTimeout] = useState<NodeJS.Timeout | null>(null);

  // Default config with context overrides
  const config = useMemo(
    () => ({
      threshold: 10,
      touchAction: 'manipulation' as const,
      debug: false,
      doubleClickDelay: 250,
      ...context?.scrollConfig,
      ...viewConfig,
    }),
    [context?.scrollConfig, viewConfig]
  );

  const scrollAware = useScrollAwareClick<HTMLElement>(
    (e) => {
      // Handle potential double-click delay
      if (config.doubleClickDelay > 0) {
        if (clickTimeout) {
          clearTimeout(clickTimeout);
        }

        const timeout = setTimeout(() => {
          handlers.onItemClick(item, e);
          setClickTimeout(null);
        }, config.doubleClickDelay);

        setClickTimeout(timeout);
      } else {
        handlers.onItemClick(item, e);
      }
    },
    {
      threshold: config.threshold,
      touchAction: config.touchAction,
      debug: config.debug,
    }
  );

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      // Clear single click timeout on double click
      if (clickTimeout) {
        clearTimeout(clickTimeout);
        setClickTimeout(null);
      }
      handlers.onItemDoubleClick(item, e);
    },
    [clickTimeout, item, handlers]
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      // Only trigger double-click behavior if we haven't moved (scrolled)
      if (!scrollAware.state.moved) {
        handlers.onItemDoubleClick(item, e);
      }
    },
    [scrollAware.state.moved, item, handlers]
  );

  // Return props that can be spread onto any element
  return {
    itemProps: {
      ...scrollAware.props,
      onDoubleClick: handleDoubleClick,
      onTouchEnd: handleTouchEnd,
      // Merge drag handlers if provided
      ...(handlers.onDragStart && {
        draggable: true,
        onDragStart: () => handlers.onDragStart!(item),
        onDragOver: (e: React.DragEvent) => handlers.onDragOver?.(item, e),
        onDrop: (e: React.DragEvent) => handlers.onDrop?.(item, e),
      }),
    },
    scrollState: scrollAware.state,
    mergeStyles: (additionalStyles: CSSProperties = {}) => ({
      ...scrollAware.props.style,
      cursor: 'pointer',
      ...additionalStyles,
    }),
  };
};
