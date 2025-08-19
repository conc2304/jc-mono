import React, { useCallback, useContext } from 'react';

import { IconsView, ListView, DetailsView } from './views';
import { FileSystemContext, useWindowActions } from '../../context';
import { BaseFileSystemItem } from '@jc/file-system';

// 1. Enhanced FileSystemContext (add this to your existing context file)
interface ScrollAwareConfig {
  threshold: number;
  touchAction: CSSProperties['touchAction'];
  debug: boolean;
  doubleClickDelay: number;
}

// Add to your existing FileSystemContext interface
interface FileSystemContextType {
  // ... your existing properties
  scrollConfig?: ScrollAwareConfig;
}

// 2. Hook for file system items with scroll-aware behavior
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

// 3. Updated FileListView (minimal changes to your existing code)
export const FileListView = ({ items }: { items: BaseFileSystemItem[] }) => {
  const context = useContext(FileSystemContext);
  const { openWindow } = useWindowActions();

  // Your existing handlers remain the same
  const handleItemClick = useCallback(
    (item: BaseFileSystemItem, event: React.MouseEvent) => {
      event.preventDefault();
      if (event.button === 2) return;
      context?.selectItem(item.id, false); // TODO handle multi select
    },
    [context]
  );

  const handleItemDoubleClick = useCallback(
    (item: BaseFileSystemItem, event: React.MouseEvent | React.TouchEvent) => {
      if ('button' in event && event.button === 2) return;

      if (item.type === 'folder') {
        context?.navigateToPath(item.path);
      } else {
        openWindow(item.id);
      }
    },
    [context]
  );

  const handleDragStart = useCallback(
    (item: BaseFileSystemItem) => {
      context?.setDraggedItems([item.id]);
    },
    [context]
  );

  const handleDragOver = useCallback(
    (targetItem: BaseFileSystemItem, e: React.DragEvent) => {
      e.preventDefault();
      if (e.button === 2) return; // ignore right click
      // TODO
    },
    []
  );

  const handleDrop = useCallback(
    (targetItem: BaseFileSystemItem, e: React.DragEvent) => {
      e.preventDefault();
      if (e.button === 2) return; // ignore right click
      if (targetItem.type === 'folder' && context?.draggedItems) {
        context.moveItems(context.draggedItems, targetItem.path);
      }
    },
    [context]
  );

  // Create handlers object for the hook
  const handlers = useMemo(
    () => ({
      onItemClick: handleItemClick,
      onItemDoubleClick: handleItemDoubleClick,
      onDragStart: handleDragStart,
      onDragOver: handleDragOver,
      onDrop: handleDrop,
    }),
    [
      handleItemClick,
      handleItemDoubleClick,
      handleDragStart,
      handleDragOver,
      handleDrop,
    ]
  );

  if (context?.viewMode === 'details') {
    return (
      <DetailsView
        items={items}
        handlers={handlers} // Pass handlers object instead of individual props
        useFileSystemItem={useFileSystemItem} // Pass the hook
        viewConfig={{ touchAction: 'pan-y', threshold: 12 }} // Table-specific config
      />
    );
  }

  if (context?.viewMode === 'icons') {
    return (
      <IconsView
        items={items}
        handlers={handlers}
        useFileSystemItem={useFileSystemItem}
        viewConfig={{ touchAction: 'manipulation', threshold: 8 }} // Grid-specific config
      />
    );
  }

  return (
    <ListView
      items={items}
      handlers={handlers}
      useFileSystemItem={useFileSystemItem}
      viewConfig={{ touchAction: 'pan-y', threshold: 10 }} // List-specific config
    />
  );
};

// 4. Example implementation for DetailsView (update your existing view components)
interface ViewProps {
  items: BaseFileSystemItem[];
  handlers: {
    onItemClick: (item: BaseFileSystemItem, e: React.MouseEvent) => void;
    onItemDoubleClick: (
      item: BaseFileSystemItem,
      e: React.MouseEvent | React.TouchEvent
    ) => void;
    onDragStart: (item: BaseFileSystemItem) => void;
    onDragOver: (item: BaseFileSystemItem, e: React.DragEvent) => void;
    onDrop: (item: BaseFileSystemItem, e: React.DragEvent) => void;
  };
  useFileSystemItem: typeof useFileSystemItem;
  viewConfig?: Partial<ScrollAwareClickConfig>;
}

// Example of how to update your DetailsView component
export const DetailsView: React.FC<ViewProps> = ({
  items,
  handlers,
  useFileSystemItem,
  viewConfig,
}) => {
  const context = useContext(FileSystemContext);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Type</TableCell>
          <TableCell>Size</TableCell>
          <TableCell>Modified</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {items.map((item) => {
          const fileSystemItem = useFileSystemItem(item, handlers, viewConfig);

          return (
            <TableRow
              key={item.id}
              hover
              selected={context?.selectedItems.includes(item.id)}
              {...fileSystemItem.itemProps}
              sx={fileSystemItem.mergeStyles({
                backgroundColor: context?.selectedItems.includes(item.id)
                  ? 'action.selected'
                  : undefined,
              })}
            >
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.type}</TableCell>
              <TableCell>{item.size || '-'}</TableCell>
              <TableCell>{item.modified || '-'}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

// 5. Example for IconsView
export const IconsView: React.FC<ViewProps> = ({
  items,
  handlers,
  useFileSystemItem,
  viewConfig,
}) => {
  const context = useContext(FileSystemContext);

  return (
    <Grid container spacing={2}>
      {items.map((item) => {
        const fileSystemItem = useFileSystemItem(item, handlers, viewConfig);

        return (
          <Grid item xs={6} sm={4} md={3} lg={2} key={item.id}>
            <Card
              {...fileSystemItem.itemProps}
              sx={fileSystemItem.mergeStyles({
                border: context?.selectedItems.includes(item.id) ? 2 : 1,
                borderColor: context?.selectedItems.includes(item.id)
                  ? 'primary.main'
                  : 'divider',
                height: 120,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              })}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                {item.type === 'folder' ? <FolderIcon /> : <DescriptionIcon />}
                <Typography variant="caption" noWrap>
                  {item.name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

// 6. Example for ListView
export const ListView: React.FC<ViewProps> = ({
  items,
  handlers,
  useFileSystemItem,
  viewConfig,
}) => {
  const context = useContext(FileSystemContext);

  return (
    <List>
      {items.map((item) => {
        const fileSystemItem = useFileSystemItem(item, handlers, viewConfig);

        return (
          <ListItem
            key={item.id}
            {...fileSystemItem.itemProps}
            selected={context?.selectedItems.includes(item.id)}
            sx={fileSystemItem.mergeStyles({
              borderRadius: 1,
              mb: 0.5,
            })}
          >
            <ListItemIcon>
              {item.type === 'folder' ? <FolderIcon /> : <DescriptionIcon />}
            </ListItemIcon>
            <ListItemText primary={item.name} secondary={item.type} />
          </ListItem>
        );
      })}
    </List>
  );
};
