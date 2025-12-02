import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
} from '@mui/material';
import { GradientPatternVisualizer, type Gradient, type GradientPatternConfig } from '@jc/ui-components';

interface SaveSceneDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (name: string, description?: string) => void;
  sceneType: 'solid-color' | 'gradient-pattern';
  // For preview
  color?: string | null;
  gradient?: Gradient | null;
  patternConfig?: GradientPatternConfig | null;
}

export const SaveSceneDialog = ({
  open,
  onClose,
  onSave,
  sceneType,
  color,
  gradient,
  patternConfig,
}: SaveSceneDialogProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSave = () => {
    if (!name.trim()) return;
    onSave(name.trim(), description.trim() || undefined);
    handleClose();
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Save Current State as Scene</DialogTitle>
      <DialogContent>
        {/* Preview */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Preview:
          </Typography>
          <Box
            sx={{
              borderRadius: 1,
              overflow: 'hidden',
              height: 80,
              border: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            {sceneType === 'solid-color' && color ? (
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: color,
                }}
              />
            ) : sceneType === 'gradient-pattern' &&
              gradient &&
              patternConfig ? (
              <GradientPatternVisualizer
                type={patternConfig.type}
                interpolation={patternConfig.interpolation}
                stops={gradient.stops}
                width="100%"
                height={80}
              />
            ) : null}
          </Box>
        </Box>

        <TextField
          autoFocus
          margin="dense"
          label="Scene Name"
          type="text"
          fullWidth
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Sunset Vibes, Cool Blue Wave"
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          label="Description (optional)"
          type="text"
          fullWidth
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add notes about this scene..."
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!name.trim()}
        >
          Save Scene
        </Button>
      </DialogActions>
    </Dialog>
  );
};
