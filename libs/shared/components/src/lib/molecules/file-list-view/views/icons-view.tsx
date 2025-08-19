import { useContext } from 'react';
import { Box, Grid } from '@mui/material';
import { Star } from 'lucide-react';

import { FileListViewProps } from './types';
import { FileSystemContext } from '../../../context';
import { FileSystemIcon } from '../../desktop-icon';

export const IconsView = ({
  items,
  handlers,
  useFileSystemItem,
  viewConfig,
}: FileListViewProps) => {
  const context = useContext(FileSystemContext);

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      {items.map((item) => {
        const fileSystemItem = useFileSystemItem(item, handlers, viewConfig);

        return (
          <Grid key={item.id}>
            <Box
              {...fileSystemItem.itemProps}
              style={fileSystemItem.mergeStyles({})}
            >
              <FileSystemIcon
                name={item.name}
                icon={item.icon}
                isActive={!!context?.selectedItems.includes(item.id)}
                tagContent={
                  item.metadata.favorite && (
                    <Star
                      size={12}
                      color="gold"
                      style={{
                        display: 'inline',
                        lineHeight: 1.5,
                        paddingBottom: '2px',
                        paddingRight: '2px',
                      }}
                    />
                  )
                }
              />
            </Box>
          </Grid>
        );
      })}
    </Grid>
  );
};
