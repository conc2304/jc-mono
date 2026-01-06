import {
  AugmentedButton,
  GradientPatternVisualizer,
  SineWaveIcon,
  TriangleWaveIcon,
  SawtoothWaveIcon,
  SquareWaveIcon,
} from '@jc/ui-components';
import { TbEscalator, TbStairs } from 'react-icons/tb';

import { PlayArrow } from '@mui/icons-material';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Chip,
  IconButton,
  Theme,
  Typography,
} from '@mui/material';
import { alpha, Stack } from '@mui/system';
import { DeleteIcon, EditIcon, RabbitIcon, TurtleIcon } from 'lucide-react';
import { Scene } from '../../../types/storage';
import { InterpolationMode, WaveType } from '@jc/utils';
import { ReactNode } from 'react';

interface SceneCardProps {
  scene: Scene;
  onPlayScene: (scene: Scene) => void;
  onDeleteScene: (sceneId: string) => void;
  onUpdateScene?: (sceneId: string, updates: Partial<Scene>) => void;
  onEditScene: (scene: Scene) => void;
}
export const SceneCard = ({
  scene,
  onPlayScene,
  onUpdateScene,
  onEditScene,
  onDeleteScene,
}: SceneCardProps) => {
  console.log({ scene });
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

  const waveIconMap: Record<Exclude<WaveType, null>, ReactNode> = {
    sawtooth: <SawtoothWaveIcon fontSize="small" />,
    sine: <SineWaveIcon fontSize="small" />,
    triangle: <TriangleWaveIcon fontSize="small" />,
    square: <SquareWaveIcon fontSize="small" />,
  };

  const interpIconMap: Record<InterpolationMode, ReactNode> = {
    linear: <TbEscalator fontSize="1rem" />,
    step: <TbStairs fontSize="1rem" />,
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

  return (
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
              scene.type === 'solid-color' ? 'Solid Color' : 'Gradient Pattern'
            }
            variant="outlined"
            size="small"
            color={scene.type === 'solid-color' ? 'secondary' : 'primary'}
          />

          {scene.patternConfig && (
            <Chip
              label={scene.patternConfig.type}
              size="small"
              variant="outlined"
            />
          )}

          {scene.patternConfig?.interpolation && (
            <Chip
              label={interpIconMap[scene.patternConfig?.interpolation]}
              sx={{
                pt: 0.5,
              }}
              size="small"
              variant="outlined"
            />
          )}

          {scene.patternConfig?.speed && (
            <Chip
              label={
                scene.patternConfig.speed < 50 ? (
                  <TurtleIcon fontSize="small" strokeWidth={1} />
                ) : (
                  <RabbitIcon fontSize="small" strokeWidth={1} />
                )
              }
              sx={{
                pt: 0.5,
              }}
              size="small"
              variant="outlined"
            />
          )}

          {scene.patternConfig?.wave?.type && (
            <Chip
              label={waveIconMap[scene.patternConfig.wave.type]}
              size="small"
              variant="outlined"
              sx={{
                pt: 0.6,
              }}
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
          startIcon={<PlayArrow />}
          onClick={() => onPlayScene(scene)}
          sx={{ flexGrow: 1 }}
        >
          Play
        </AugmentedButton>
        <IconButton
          size="small"
          onClick={() => onEditScene(scene)}
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
  );
};
