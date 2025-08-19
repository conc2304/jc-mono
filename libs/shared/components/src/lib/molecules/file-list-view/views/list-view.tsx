import { useContext } from 'react';
import {
  alpha,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import { FileSystemContext } from '../../../context';
import { OverflowChipContainer } from '../../overflow-chip-container';
import { Star } from 'lucide-react';
import { ensureContrast } from '@jc/utils';
import { FileListViewProps } from './types';

export const ListView = ({
  items,
  handlers,
  useFileSystemItem,
  viewConfig,
}: FileListViewProps) => {
  const context = useContext(FileSystemContext);
  const theme = useTheme();
  const isLg = useMediaQuery(theme.breakpoints.up('sm'));

  const selectedBg = ensureContrast(
    theme.palette.text.primary,
    theme.palette.getInvertedMode('primary'),
    5
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
        const fileSystemItem = useFileSystemItem(item, handlers, viewConfig);

        return (
          <ListItem
            key={item.id}
            // component="button"
            draggable
            {...fileSystemItem.itemProps}
            sx={(theme) => ({
              background: isSelected ? alpha(selectedBg, 0.5) : 'transparent',
              borderWidth: 0,
              borderTopWidth: '2px',
              borderBottomWidth: '2px',
              borderStyle: 'solid',
              borderColor: isSelected ? 'primary.main' : 'transparent',
              // Slow transition for mouse out (default state)
              transition: 'border-color 0.75s ease-out',
              '&:hover': {
                borderColor: !isSelected ? 'secondary.main' : 'primary.main',
                // Fast transition for mouse in
                transition: 'border-color 0s ease-in',
              },
            })}
            style={fileSystemItem.mergeStyles({})}
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
            {isLg && (
              <OverflowChipContainer
                tags={item.metadata.tags}
                favorite={item.metadata.favorite}
                bgColor={selectedBg}
                isSelected={isSelected}
              />
            )}
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
