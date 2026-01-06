import { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import type { Scene } from '../../../types/storage';
import { SceneCard } from '../../molecules';

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

  return (
    <>
      <Grid container spacing={2} m={1}>
        {scenes.map((scene) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={scene.id}>
            <SceneCard
              scene={scene}
              onPlayScene={onPlayScene}
              onDeleteScene={onDeleteScene}
              onEditScene={handleEditClick}
            />
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
