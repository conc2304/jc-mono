import { Box, Paper, Modal, Typography, IconButton, Button } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { ColorGradientEditor, ColorStop, GradientData } from '../ColorGradientEditor';

interface CustomGradientEditorModalProps {
  isOpen: boolean;
  customGradientStops: ColorStop[];
  onClose: () => void;
  onGradientChange: (gradientData: GradientData) => void;
  onSaveGradient: () => void;
}

export const CustomGradientEditorModal = ({
  isOpen,
  customGradientStops,
  onClose,
  onGradientChange,
  onSaveGradient,
}: CustomGradientEditorModalProps) => {
  const theme = useTheme();

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper
        sx={{
          p: 3,
          maxWidth: 800,
          width: '100%',
          mx: 2,
          maxHeight: '90vh',
          overflow: 'auto',
          outline: 'none',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Create Custom Gradient
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{ color: theme.palette.text.secondary }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Gradient Editor */}
        <ColorGradientEditor
          initialStops={customGradientStops}
          onGradientChange={onGradientChange}
          showTitle={false}
        />

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          <Button fullWidth variant="contained" onClick={onSaveGradient}>
            Save & Apply Gradient
          </Button>
          <Button variant="outlined" onClick={onClose} sx={{ px: 2 }}>
            Cancel
          </Button>
        </Box>
      </Paper>
    </Modal>
  );
};
