import { useContext } from 'react';
import { Box, Grid } from '@mui/material';

import { FileListViewProps } from './types';
import { FileSystemContext } from '../../../context';
import { FileSystemIcon } from '../../desktop-icon';
import { Star } from '@mui/icons-material';

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
                      style={{
                        fontSize: 12,
                        color: 'warning.main',
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
