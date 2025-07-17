import { useContext } from 'react';
import {
  Box,
  Chip,
  inputAdornmentClasses,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { Star } from 'lucide-react';

import { FileSystemContext } from '../../../context';
import { FileSystemItem } from '../../../types';

interface ListViewProps {
  items: FileSystemItem[];
  onItemClick: (item: FileSystemItem, event: React.MouseEvent) => void;
  onItemDoubleClick: (item: FileSystemItem, event: React.MouseEvent) => void;
  onDragStart: (item: FileSystemItem) => void;
  onDragOver: (targetItem: FileSystemItem, e: React.DragEvent) => void;
  onDrop: (targetItem: FileSystemItem, e: React.DragEvent) => void;
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
          onDragStart={() => onDragStart(item)}
          onDragOver={(e) => onDragOver(item, e)}
          onDrop={(e) => onDrop(item, e)}
          secondaryAction={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {item.metadata.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  variant="outlined"
                  slotProps={{
                    label: {
                      color: 'textPrimary',
                    },
                  }}
                />
              ))}
              {item.metadata.favorite && <Star size={16} color="gold" />}
            </Box>
          }
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
            slotProps={{
              primary: {
                color: 'textPrimary',
              },
              secondary: {
                color: 'textSecondary',
              },
            }}
          />
        </ListItem>
      ))}
    </List>
  );
};
