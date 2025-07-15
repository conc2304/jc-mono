import { useContext } from 'react';
import {
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Box, Grid } from '@mui/system';
import { Star } from 'lucide-react';

import { FileSystemContext } from '../../context';
import { FileSystemItem } from '../../types';

export // File List Views
const FileListView = ({ items }: { items: FileSystemItem[] }) => {
  const context = useContext(FileSystemContext);

  const handleItemClick = (item: FileSystemItem, event: React.MouseEvent) => {
    event.preventDefault();
    if (event.button === 2) return;

    if (event.ctrlKey || event.metaKey) {
      context?.selectItem(item.id, true);
    } else {
      context?.selectItem(item.id, false);
      if (item.type === 'folder') {
        context?.navigateToPath(item.path);
      }
    }
  };

  const handleDragStart = (item: FileSystemItem) => {
    context?.setDraggedItems([item.id]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.button === 2) return; // ignore right click
  };

  const handleDrop = (targetItem: FileSystemItem, e: React.DragEvent) => {
    e.preventDefault();
    if (e.button === 2) return; // ignore right click
    if (targetItem.type === 'folder' && context?.draggedItems) {
      context.moveItems(context.draggedItems, targetItem.path);
    }
  };

  if (context?.viewMode === 'details') {
    return (
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Date Modified</TableCell>
            <TableCell>Size</TableCell>
            <TableCell>Type</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow
              key={item.id}
              hover
              selected={context?.selectedItems.includes(item.id)}
              onDoubleClick={(e) => handleItemClick(item, e)}
              draggable
              onDragStart={() => handleDragStart(item)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(item, e)}
              sx={{ cursor: 'pointer' }}
            >
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {item.icon}
                  {item.name}
                  {item.metadata.favorite && <Star size={12} color="gold" />}
                </Box>
              </TableCell>
              <TableCell>{item.dateModified.toLocaleDateString()}</TableCell>
              <TableCell>
                {item.size ? `${Math.round(item.size / 1024)} KB` : '-'}
              </TableCell>
              <TableCell>
                {item.type === 'folder'
                  ? 'Folder'
                  : item.extension?.toUpperCase() || 'File'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  if (context?.viewMode === 'large-icons') {
    return (
      <Grid container spacing={2} sx={{ p: 2 }}>
        {items.map((item) => (
          <Grid
            // item
            key={item.id}
          >
            <Card
              sx={{
                width: 120,
                cursor: 'pointer',
                border: context?.selectedItems.includes(item.id) ? 2 : 0,
                borderColor: 'primary.main',
              }}
              onDoubleClick={(e) => handleItemClick(item, e)}
              draggable
              onDragStart={() => handleDragStart(item)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(item, e)}
            >
              <CardContent sx={{ textAlign: 'center', p: 1 }}>
                {item.icon}
                <Typography
                  variant="caption"
                  display="block"
                  sx={{ mt: 1, wordBreak: 'break-word' }}
                >
                  {item.name}
                </Typography>
                {item.metadata.favorite && (
                  <Star size={12} color="gold" style={{ marginTop: 4 }} />
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  // List and small-icons view
  return (
    <List>
      {items.map((item) => (
        <ListItem
          key={item.id}
          // selected={context?.selectedItems.includes(item.id)}
          onDoubleClick={(e) => handleItemClick(item, e)}
          // draggable    // todo make draggle
          onDragStart={() => handleDragStart(item)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(item, e)}
          // secondaryAction={
          //   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          //     {item.metadata.tags.map((tag) => (
          //       <Chip key={tag} label={tag} size="small" variant="outlined" />
          //     ))}
          //     {item.metadata.favorite && <Star size={16} color="gold" />}
          //   </Box>
          // }
        >
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText
            primary={item.name}
            secondary={`Modified: ${item.dateModified.toLocaleDateString()}`}
          />
        </ListItem>
      ))}
    </List>
  );
};
