import {
  alpha,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Star } from '@mui/icons-material';
import { OverflowChipContainer } from '../../overflow-chip-container';
import { ensureContrast } from '@jc/utils';
import { useFileSystemItem } from '../../../hooks/use-file-list-item';
import { useContext } from 'react';
import { FileSystemContext } from '../../../context';
import { FileListItemProps } from './types';

export const ListViewItem = ({
  item,
  handlers,
  viewConfig,
}: FileListItemProps) => {
  const context = useContext(FileSystemContext);
  const theme = useTheme();
  const isLg = useMediaQuery(theme.breakpoints.up('sm'));

  const fileSystemItem = useFileSystemItem(item, handlers, viewConfig);
  const isSelected = context?.selectedItems.includes(item.id);

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
    <ListItem
      key={item.id}
      draggable
      {...fileSystemItem.itemProps}
      sx={(theme) => ({
        background: isSelected ? alpha(selectedBg, 0.5) : 'transparent',
        borderWidth: 0,
        borderTopWidth: '2px',
        borderBottomWidth: '2px',
        borderStyle: 'solid',
        borderColor: isSelected ? 'primary.main' : 'transparent',
        transition: 'border-color 0.75s ease-out',
        '&:hover': {
          borderColor: !isSelected ? 'secondary.main' : 'primary.main',
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
        style={{
          flexShrink: 0,
          color: 'warning.main',
          fill: 'currentcolor',
          fontSize: 16,
          visibility: item.metadata.favorite ? 'visible' : 'hidden',
        }}
      />
    </ListItem>
  );
};
