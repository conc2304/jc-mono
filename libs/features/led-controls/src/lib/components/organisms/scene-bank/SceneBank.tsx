import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  IconButton,
  TextField,
  Typography,
  Chip,
  Stack,
  Theme,
  alpha,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  PlayArrow as PlayArrowIcon,
} from '@mui/icons-material';
import { AugmentedButton, GradientPatternVisualizer } from '@jc/ui-components';
import type { Scene } from '../../../types/storage';

interface SceneBankProps {
  scenes: Scene[];
  onPlayScene: (scene: Scene) => void;
  onDeleteScene: (sceneId: string) => void;
  onUpdateScene?: (sceneId: string, updates: Partial<Scene>) => void;
}

export const SceneBank = ({
  scenes,
  onPlayScene,
  onDeleteScene,
  onUpdateScene,
}: SceneBankProps) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingScene, setEditingScene] = useState<Scene | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const handleEditClick = (scene: Scene) => {
    setEditingScene(scene);
    setEditName(scene.name);
    setEditDescription(scene.description || '');
    setEditDialogOpen(true);
  };

  const handleEditSave = () => {
    if (editingScene && onUpdateScene) {
      onUpdateScene(editingScene.id, {
        name: editName,
        description: editDescription,
      });
    }
    setEditDialogOpen(false);
    setEditingScene(null);
  };

  const handleEditCancel = () => {
    setEditDialogOpen(false);
    setEditingScene(null);
    setEditName('');
    setEditDescription('');
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (scenes.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          No saved scenes yet. Create a scene by configuring a color or pattern
          and clicking "Save as Scene" above.
        </Typography>
      </Box>
    );
  }
  const augmentedStyle = {
    attr: 'border tr-clip tl-clip',
    sx: (theme: Theme) => ({
      '--aug-border-all': '2px',
      '--aug-border-bg': theme.palette.divider,
      '--aug-tr': theme.spacing(1),
      '--aug-tl': theme.spacing(1),
      borderRadius: 0,
    }),
  };

  return (
    <>
      <Grid container spacing={2} m={1}>
        {scenes.map((scene) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={scene.id}>
            <Card
              data-augmented-ui={augmentedStyle.attr}
              sx={(theme) => ({
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: alpha(theme.palette.background.default, 0.7),
                ...augmentedStyle.sx(theme),
              })}
            >
              <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                {/* Visual Preview */}
                <Box
                  data-augmented-ui={augmentedStyle.attr}
                  sx={(theme) => ({
                    mb: 2,
                    overflow: 'hidden',
                    height: 80,
                    ...augmentedStyle.sx(theme),
                  })}
                >
                  {scene.type === 'solid-color' && scene.color ? (
                    <Box
                      sx={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: scene.color,
                      }}
                    />
                  ) : scene.type === 'gradient-pattern' &&
                    scene.gradient &&
                    scene.patternConfig ? (
                    <GradientPatternVisualizer
                      type={scene.patternConfig.type}
                      interpolation={scene.patternConfig.interpolation}
                      stops={scene.gradient.stops}
                      width="100%"
                      height={80}
                    />
                  ) : null}
                </Box>

                {/* Scene Info */}
                <Typography variant="h6" gutterBottom noWrap>
                  {scene.name}
                </Typography>

                {scene.description && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 1,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {scene.description}
                  </Typography>
                )}

                <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                  <Chip
                    label={
                      scene.type === 'solid-color'
                        ? 'Solid Color'
                        : 'Gradient Pattern'
                    }
                    variant="outlined"
                    size="small"
                    color={
                      scene.type === 'solid-color' ? 'primary' : 'secondary'
                    }
                  />
                  {scene.patternConfig && (
                    <Chip
                      label={scene.patternConfig.type}
                      size="small"
                      variant="outlined"
                    />
                  )}
                </Stack>

                <Typography variant="caption" color="text.secondary">
                  Created {formatDate(scene.createdAt)}
                </Typography>
              </CardContent>

              <CardActions sx={{ pt: 0, px: 2, pb: 2 }}>
                <AugmentedButton
                  size="small"
                  variant="contained"
                  color="primary"
                  startIcon={<PlayArrowIcon />}
                  onClick={() => onPlayScene(scene)}
                  sx={{ flexGrow: 1 }}
                >
                  Play
                </AugmentedButton>
                <IconButton
                  size="small"
                  onClick={() => handleEditClick(scene)}
                  aria-label="edit scene"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => onDeleteScene(scene.id)}
                  aria-label="delete scene"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={handleEditCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Scene</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Scene Name"
            type="text"
            fullWidth
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description (optional)"
            type="text"
            fullWidth
            multiline
            rows={3}
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditCancel}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
