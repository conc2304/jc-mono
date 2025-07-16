import { useContext } from 'react';
import { Box, Chip, Divider, IconButton, Typography } from '@mui/material';
import { ChevronDown, ChevronLeft, Info } from 'lucide-react';

import { FileSystemContext } from '../../context';

interface PreviewPanelProps {
  collapsed: boolean;
  onToggle: () => void;
}

export const PreviewPanel = ({ collapsed, onToggle }: PreviewPanelProps) => {
  const context = useContext(FileSystemContext);
  const selectedItem =
    context?.selectedItems.length === 1
      ? context.fs.find((item) => item.id === context.selectedItems[0])
      : null;

  return (
    <Box
      sx={{
        width: collapsed ? 48 : 250,
        height: '100%',
        borderLeft: 1,
        borderColor: 'divider',
        transition: 'width 0.3s ease',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          p: 1,
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'end',
        }}
      >
        {!collapsed && (
          <Typography variant="subtitle2" component="span" sx={{ ml: 1 }}>
            Preview
          </Typography>
        )}
        <IconButton onClick={onToggle} size="small">
          {collapsed ? <ChevronLeft /> : <ChevronDown />}
        </IconButton>
      </Box>

      {!collapsed &&
        (!selectedItem ? (
          <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
            <Info size={48} style={{ margin: '0 auto' }} />
            <Typography variant="body2" sx={{ mt: 1 }}>
              Select an item to preview
            </Typography>
          </Box>
        ) : (
          <Box sx={{ p: 2, height: '100%', overflow: 'auto' }}>
            <Box sx={{ textAlign: 'center', mb: 2 }}>{selectedItem.icon}</Box>

            <Typography variant="h6" gutterBottom>
              {selectedItem.name}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" gutterBottom>
              Properties
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Type:
                </Typography>
                <Typography variant="body2">{selectedItem.type}</Typography>
              </Box>

              {selectedItem.size && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Size:
                  </Typography>
                  <Typography variant="body2">
                    {Math.round(selectedItem.size / 1024)} KB
                  </Typography>
                </Box>
              )}

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Modified:
                </Typography>
                <Typography variant="body2">
                  {selectedItem.dateModified.toLocaleDateString()}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Created:
                </Typography>
                <Typography variant="body2">
                  {selectedItem.dateCreated.toLocaleDateString()}
                </Typography>
              </Box>
            </Box>

            {selectedItem.metadata.description && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" gutterBottom>
                  Description
                </Typography>
                <Typography variant="body2">
                  {selectedItem.metadata.description}
                </Typography>
              </>
            )}

            {selectedItem.metadata.tags.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" gutterBottom>
                  Tags
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selectedItem.metadata.tags.map((tag) => (
                    <Chip key={tag} label={tag} size="small" />
                  ))}
                </Box>
              </>
            )}
          </Box>
        ))}
    </Box>
  );
};
