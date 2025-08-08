import { useContext } from 'react';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
} from '@mui/material';

import { FileSystemContext } from '../../../context';
import { BaseFileSystemItem } from '@jc/file-system';
import { OverflowChipContainer } from '../../overflow-chip-container';
import { Star } from 'lucide-react';
import { ensureContrast } from '@jc/utils';

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
  const theme = useTheme();

  const selectedBg = ensureContrast(
    theme.palette.text.primary,
    theme.palette.getInvertedMode('primary')
  ).color;

  const selectedTextPrimary = ensureContrast(
    theme.palette.primary.main,
    selectedBg
  ).color;

  const selectedTextSecondary = ensureContrast(
    theme.palette.text.secondary,
    selectedBg
  ).color;

  const selectedIconColor = ensureContrast(
    theme.palette.primary.main,
    selectedBg,
    5
  ).color;

  return (
    <List className="FileListView--root">
      {items.map((item) => {
        const isSelected = context?.selectedItems.includes(item.id);
        return (
          <ListItem
            key={item.id}
            component="button"
            draggable
            onClick={(e) => onItemClick(item, e)}
            onDoubleClick={(e) => onItemDoubleClick(item, e)}
            onTouchEnd={(e) => onItemDoubleClick(item, e)}
            onDragStart={() => onDragStart(item)}
            onDragOver={(e) => onDragOver(item, e)}
            onDrop={(e) => onDrop(item, e)}
            sx={(theme) => ({
              // TODO
              background: isSelected ? selectedBg : 'transparent',
            })}
          >
            <ListItemIcon
              sx={{
                '& svg': { color: isSelected ? selectedIconColor : undefined },
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.name}
              secondary={`Modified: ${item.dateModified.toLocaleDateString()}`}
              sx={{ flex: '1 0 auto' }}
              slotProps={{
                primary: {
                  color: isSelected ? selectedTextPrimary : 'textPrimary',
                },
                secondary: {
                  color: isSelected ? selectedTextSecondary : 'textSecondary',
                },
              }}
            />
            <OverflowChipContainer
              tags={item.metadata.tags}
              favorite={item.metadata.favorite}
              bgColor={selectedBg}
              isSelected={isSelected}
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
        );
      })}
    </List>
  );
};
