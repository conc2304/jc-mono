import React, { useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import { uploadMask, type UploadProgress } from '@jc/shared/of-control-client';

interface Props {
  baseUrl?: string;
  onEdit?: (file: File) => void;
}

const ACCEPTED = 'image/png,image/jpeg,image/webp';

export const MaskCapture: React.FC<Props> = ({ baseUrl = '', onEdit }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (f: File) => {
    setFile(f);
    setUploaded(false);
    setError(null);
    setProgress(null);
    const url = URL.createObjectURL(f);
    setPreview(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      await uploadMask(file, baseUrl, setProgress);
      setUploaded(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setPreview(null);
    setUploaded(false);
    setError(null);
    setProgress(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="overline" sx={{ letterSpacing: 1 }}>Mask Image</Typography>

      {preview ? (
        <Box sx={{ position: 'relative' }}>
          <Box
            component="img"
            src={preview}
            alt="Mask preview"
            sx={{ width: '100%', borderRadius: 2, display: 'block', maxHeight: 240, objectFit: 'contain', backgroundColor: '#111' }}
          />
          <IconButton
            size="small"
            onClick={handleClear}
            sx={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.6)' }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
          {file && (
            <Chip
              size="small"
              label={file.name}
              sx={{ position: 'absolute', bottom: 8, left: 8, fontSize: '0.65rem', backgroundColor: 'rgba(0,0,0,0.7)' }}
            />
          )}
        </Box>
      ) : (
        <Box
          onClick={() => fileInputRef.current?.click()}
          sx={{
            border: '2px dashed',
            borderColor: 'divider',
            borderRadius: 2,
            py: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
            cursor: 'pointer',
            '&:hover': { borderColor: 'primary.main', backgroundColor: 'rgba(255,107,53,0.04)' },
          }}
        >
          <CloudUploadIcon color="action" />
          <Typography variant="body2" color="text.secondary">Tap to select image</Typography>
          <Typography variant="caption" color="text.disabled">PNG, JPEG, WEBP</Typography>
        </Box>
      )}

      <input ref={fileInputRef} type="file" accept={ACCEPTED} hidden onChange={handleFileChange} />
      <input ref={cameraInputRef} type="file" accept={ACCEPTED} capture="environment" hidden onChange={handleFileChange} />

      {uploading && progress && (
        <Box>
          <LinearProgress variant="determinate" value={progress.percent} />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
            Uploading… {progress.percent}%
          </Typography>
        </Box>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      {uploaded && (
        <Alert severity="success" icon={<CheckCircleIcon />}>
          Mask uploaded successfully
        </Alert>
      )}

      <Stack direction="row" spacing={1}>
        <Button
          size="small"
          variant="outlined"
          startIcon={<CameraAltIcon />}
          onClick={() => cameraInputRef.current?.click()}
          fullWidth
        >
          Camera
        </Button>
        <Button
          size="small"
          variant="outlined"
          startIcon={<CloudUploadIcon />}
          onClick={() => fileInputRef.current?.click()}
          fullWidth
        >
          File
        </Button>
        {file && onEdit && (
          <Button
            size="small"
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => onEdit(file)}
            fullWidth
          >
            Edit
          </Button>
        )}
      </Stack>

      {file && !uploading && (
        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={uploading || uploaded}
          startIcon={uploaded ? <CheckCircleIcon /> : <CloudUploadIcon />}
        >
          {uploaded ? 'Uploaded' : 'Upload to Fireplace'}
        </Button>
      )}
    </Box>
  );
};
