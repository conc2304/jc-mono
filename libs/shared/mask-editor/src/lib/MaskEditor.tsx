import React, { useRef, useEffect, useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import IconButton from '@mui/material/IconButton';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import BrushIcon from '@mui/icons-material/Brush';
import AutoFixNormalIcon from '@mui/icons-material/AutoFixNormal';
import InvertColorsIcon from '@mui/icons-material/InvertColors';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import DownloadIcon from '@mui/icons-material/Download';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { uploadMask } from '@jc/of-control-client';

type Tool = 'brush' | 'eraser';

interface ValidationResult {
  openPercent: number;
  blockedPercent: number;
  warnings: string[];
}

const MAX_UNDO = 30;

function validateMask(ctx: CanvasRenderingContext2D, width: number, height: number): ValidationResult {
  const data = ctx.getImageData(0, 0, width, height).data;
  let black = 0;
  let white = 0;
  const total = width * height;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const gray = (r + g + b) / 3;
    if (gray < 128) black++;
    else white++;
  }

  const openPercent = Math.round((black / total) * 100);
  const blockedPercent = 100 - openPercent;
  const warnings: string[] = [];

  if (openPercent === 0) warnings.push('Mask is entirely blocked (all white). No grout will show.');
  if (openPercent === 100) warnings.push('Mask is entirely open (all black). All grout will show.');
  if (openPercent < 5) warnings.push('Very little grout is open — result may appear mostly blocked.');
  if (openPercent > 95) warnings.push('Almost all grout is open — result may lack contrast.');

  return { openPercent, blockedPercent, warnings };
}

interface Props {
  sourceFile?: File;
  baseUrl?: string;
  onUploadSuccess?: () => void;
}

export const MaskEditor: React.FC<Props> = ({ sourceFile, baseUrl = '', onUploadSuccess }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const sourceImgRef = useRef<HTMLImageElement | null>(null);
  const [tool, setTool] = useState<Tool>('brush');
  const [brushSize, setBrushSize] = useState(20);
  const [opacity, setOpacity] = useState(0.6);
  const [zoom, setZoom] = useState(1);
  const [isDrawing, setIsDrawing] = useState(false);
  const [undoStack, setUndoStack] = useState<ImageData[]>([]);
  const [redoStack, setRedoStack] = useState<ImageData[]>([]);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const getOverlay = () => overlayRef.current?.getContext('2d') ?? null;

  const saveUndo = useCallback(() => {
    const ctx = getOverlay();
    if (!ctx || !overlayRef.current) return;
    const snap = ctx.getImageData(0, 0, overlayRef.current.width, overlayRef.current.height);
    setUndoStack((prev) => [...prev.slice(-MAX_UNDO + 1), snap]);
    setRedoStack([]);
  }, []);

  const revalidate = useCallback(() => {
    const ctx = getOverlay();
    const c = overlayRef.current;
    if (!ctx || !c) return;
    setValidation(validateMask(ctx, c.width, c.height));
  }, []);

  const drawSourceImage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (sourceImgRef.current) {
      ctx.drawImage(sourceImgRef.current, 0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = '#222';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  useEffect(() => {
    if (!sourceFile) { drawSourceImage(); return; }
    const img = new Image();
    img.onload = () => {
      sourceImgRef.current = img;
      const canvas = canvasRef.current!;
      const overlay = overlayRef.current!;
      const aspect = img.width / img.height;
      canvas.width = overlay.width = Math.min(img.width, 800);
      canvas.height = overlay.height = Math.round(canvas.width / aspect);
      drawSourceImage();
      const octx = overlay.getContext('2d')!;
      octx.fillStyle = '#ffffff';
      octx.fillRect(0, 0, overlay.width, overlay.height);
      revalidate();
    };
    img.src = URL.createObjectURL(sourceFile);
  }, [sourceFile, drawSourceImage, revalidate]);

  const getPos = (e: React.MouseEvent | React.TouchEvent): { x: number; y: number } => {
    const canvas = overlayRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / (rect.width * zoom);
    const scaleY = canvas.height / (rect.height * zoom);
    if ('touches' in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const paintAt = (x: number, y: number) => {
    const ctx = getOverlay();
    if (!ctx) return;
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = tool === 'brush' ? '#000000' : '#ffffff';
    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
  };

  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    saveUndo();
    setIsDrawing(true);
    paintAt(...Object.values(getPos(e)) as [number, number]);
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    paintAt(...Object.values(getPos(e)) as [number, number]);
  };

  const handlePointerUp = () => {
    if (isDrawing) { setIsDrawing(false); revalidate(); }
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const ctx = getOverlay();
    const c = overlayRef.current;
    if (!ctx || !c) return;
    const current = ctx.getImageData(0, 0, c.width, c.height);
    setRedoStack((prev) => [...prev, current]);
    const prev = undoStack[undoStack.length - 1];
    setUndoStack((s) => s.slice(0, -1));
    ctx.putImageData(prev, 0, 0);
    revalidate();
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const ctx = getOverlay();
    const c = overlayRef.current;
    if (!ctx || !c) return;
    const current = ctx.getImageData(0, 0, c.width, c.height);
    setUndoStack((prev) => [...prev, current]);
    const next = redoStack[redoStack.length - 1];
    setRedoStack((s) => s.slice(0, -1));
    ctx.putImageData(next, 0, 0);
    revalidate();
  };

  const handleInvert = () => {
    saveUndo();
    const ctx = getOverlay();
    const c = overlayRef.current;
    if (!ctx || !c) return;
    const data = ctx.getImageData(0, 0, c.width, c.height);
    for (let i = 0; i < data.data.length; i += 4) {
      data.data[i]     = 255 - data.data[i];
      data.data[i + 1] = 255 - data.data[i + 1];
      data.data[i + 2] = 255 - data.data[i + 2];
      data.data[i + 3] = 255;
    }
    ctx.putImageData(data, 0, 0);
    revalidate();
  };

  const handleDownload = () => {
    const c = overlayRef.current;
    if (!c) return;
    const off = document.createElement('canvas');
    off.width = c.width;
    off.height = c.height;
    const ctx = off.getContext('2d')!;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, off.width, off.height);
    ctx.drawImage(c, 0, 0);
    off.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'mask.jpg';
      a.click();
      URL.revokeObjectURL(url);
    }, 'image/jpeg', 0.92);
  };

  const handleUpload = async () => {
    const c = overlayRef.current;
    if (!c) return;
    setUploading(true);
    setUploadError(null);
    const off = document.createElement('canvas');
    off.width = c.width;
    off.height = c.height;
    const ctx = off.getContext('2d')!;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, off.width, off.height);
    ctx.drawImage(c, 0, 0);

    off.toBlob(async (blob) => {
      if (!blob) { setUploading(false); return; }
      const file = new File([blob], 'mask.jpg', { type: 'image/jpeg' });
      try {
        await uploadMask(file, baseUrl);
        setUploadSuccess(true);
        onUploadSuccess?.();
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : 'Upload failed');
      } finally {
        setUploading(false);
      }
    }, 'image/jpeg', 0.92);
  };

  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity,
    touchAction: 'none',
    cursor: tool === 'brush' ? 'crosshair' : 'cell',
    mixBlendMode: 'multiply',
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="overline" sx={{ letterSpacing: 1 }}>Mask Editor</Typography>
        <Stack direction="row" spacing={0.5}>
          <IconButton size="small" onClick={handleUndo} disabled={undoStack.length === 0}><UndoIcon fontSize="small" /></IconButton>
          <IconButton size="small" onClick={handleRedo} disabled={redoStack.length === 0}><RedoIcon fontSize="small" /></IconButton>
        </Stack>
      </Box>

      <Box sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden', backgroundColor: '#111' }}>
        <canvas ref={canvasRef} width={600} height={400} style={{ width: '100%', height: 'auto', display: 'block' }} />
        <canvas
          ref={overlayRef}
          width={600}
          height={400}
          style={overlayStyle}
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onMouseLeave={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
        />
      </Box>

      <Stack direction="row" spacing={1} alignItems="center">
        <ButtonGroup size="small" variant="outlined">
          <Tooltip title="Brush — paint open grout (black)">
            <Button onClick={() => setTool('brush')} variant={tool === 'brush' ? 'contained' : 'outlined'} startIcon={<BrushIcon />}>
              Brush
            </Button>
          </Tooltip>
          <Tooltip title="Eraser — reveal blocked stone (white)">
            <Button onClick={() => setTool('eraser')} variant={tool === 'eraser' ? 'contained' : 'outlined'} startIcon={<AutoFixNormalIcon />}>
              Erase
            </Button>
          </Tooltip>
        </ButtonGroup>
        <Tooltip title="Invert mask"><IconButton size="small" onClick={handleInvert}><InvertColorsIcon /></IconButton></Tooltip>
      </Stack>

      <Box>
        <Typography variant="caption" color="text.secondary">Brush size: {brushSize}px</Typography>
        <Slider size="small" min={4} max={80} value={brushSize} onChange={(_, v) => setBrushSize(v as number)} />
      </Box>

      <Box>
        <Typography variant="caption" color="text.secondary">Mask opacity: {Math.round(opacity * 100)}%</Typography>
        <Slider size="small" min={0.1} max={1} step={0.05} value={opacity} onChange={(_, v) => setOpacity(v as number)} />
      </Box>

      <Stack direction="row" spacing={1} alignItems="center">
        <Typography variant="caption" color="text.secondary">Zoom</Typography>
        <IconButton size="small" onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}><ZoomOutIcon fontSize="small" /></IconButton>
        <Typography variant="caption">{Math.round(zoom * 100)}%</Typography>
        <IconButton size="small" onClick={() => setZoom((z) => Math.min(3, z + 0.25))}><ZoomInIcon fontSize="small" /></IconButton>
      </Stack>

      {validation && (
        <Box sx={{ p: 1.5, borderRadius: 1, border: '1px solid', borderColor: 'divider', backgroundColor: 'rgba(0,0,0,0.2)' }}>
          <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
            <Chip size="small" label={`${validation.openPercent}% open grout`} color="success" variant="outlined" />
            <Chip size="small" label={`${validation.blockedPercent}% blocked`} color="default" variant="outlined" />
          </Stack>
          {validation.warnings.map((w, i) => (
            <Alert key={i} severity="warning" sx={{ py: 0.25, mb: 0.5 }}>{w}</Alert>
          ))}
        </Box>
      )}

      <Divider />

      <Stack direction="row" spacing={1}>
        <Button size="small" variant="outlined" startIcon={<DownloadIcon />} onClick={handleDownload} fullWidth>
          Download JPEG
        </Button>
        <Button
          size="small"
          variant="contained"
          startIcon={<CloudUploadIcon />}
          onClick={handleUpload}
          disabled={uploading}
          fullWidth
        >
          {uploading ? 'Uploading…' : 'Upload to OF'}
        </Button>
      </Stack>

      {uploadSuccess && <Alert severity="success">Mask uploaded to fireplace app</Alert>}
      {uploadError && <Alert severity="error">{uploadError}</Alert>}
    </Box>
  );
};
