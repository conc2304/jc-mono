import { useContext } from 'react';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';

import { FileSystemContext } from '../../../context';
import { BaseFileSystemItem } from '@jc/file-system';
import { OverflowChipContainer } from '../../overflow-chip-container';
import { Star } from 'lucide-react';

interface ListViewProps {
  items: BaseFileSystemItem[];
  onItemClick: (item: BaseFileSystemItem, event: React.MouseEvent) => void;
  onItemDoubleClick: (
    item: BaseFileSystemItem,
    event: React.MouseEvent | React.TouchEvent
  ) => void;
  onDragStart: (item: BaseFileSystemItem) => void;
  onDragOver: (targetItem: BaseFileSystemItem, e: React.DragEvent) => void;
  onDrop: (targetItem: BaseFileSystemItem, e: React.DragEvent) => void;
}
export const ListView = ({
  items,
  onItemClick,
  onItemDoubleClick,
  onDragStart,
  onDragOver,
  onDrop,
}: ListViewProps) => {
  const context = useContext(FileSystemContext);

  return (
    <List>
      {items.map((item) => (
        <ListItem
          key={item.id}
          // selected={context?.selectedItems.includes(item.id)}
          component="button"
          draggable
          onClick={(e) => onItemClick(item, e)}
          onDoubleClick={(e) => onItemDoubleClick(item, e)}
          onTouchEnd={(e) => onItemDoubleClick(item, e)}
          onDragStart={() => onDragStart(item)}
          onDragOver={(e) => onDragOver(item, e)}
          onDrop={(e) => onDrop(item, e)}
          // secondaryAction={
          //   // <OverflowChipContainer
          //   //   tags={item.metadata.tags}
          //   //   favorite={item.metadata.favorite}
          //   // />
          // }
          sx={(theme) => ({
            // TODO
            background: context?.selectedItems.includes(item.id)
              ? theme.palette.primary[theme.palette.getInvertedMode()]
              : 'transparent',
          })}
        >
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText
            primary={item.name}
            secondary={`Modified: ${item.dateModified.toLocaleDateString()}`}
            sx={{ flex: '1 0 auto' }}
            slotProps={{
              primary: {
                color: 'textPrimary',
              },
              secondary: {
                color: 'textSecondary',
              },
            }}
          />
          <OverflowChipContainer
            tags={item.metadata.tags}
            favorite={item.metadata.favorite}
          />
          <Star
            size={16}
            color="gold"
            style={{
              flexShrink: 0,
              visibility: item.metadata.favorite ? 'visible' : 'hidden',
            }}
          />
        </ListItem>
      ))}
    </List>
  );
};
