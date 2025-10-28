import { useContext, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import { Star } from '@mui/icons-material';

import { ImageContainer, useMediaProvider } from '@jc/ui-components';

import { FileListItemProps } from './types';
import { FileSystemContext } from '../../../context';
import { useFileSystemItem } from '../../../hooks';
// import {
// FileSystemContext,
// useMediaProvider,
// } from '../../../../../../components/src/lib/context';
// import { useFileSystemItem } from '../../../hooks/use-file-list-item/use-file-list-item';
// import { ImageContainer } from '../../../../../../components/src/lib/atoms';

export const HolographicCardViewItem = ({
  item,
  handlers,
  viewConfig,
}: FileListItemProps) => {
  const context = useContext(FileSystemContext);
  const fileSystemItem = useFileSystemItem(item, handlers, viewConfig);
  const isSelected = context?.selectedItems.includes(item.id);
  const cardRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const { generateImageSources } = useMediaProvider().provider;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !innerRef.current) return;

    const card = cardRef.current;
    const inner = innerRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -15;
    const rotateY = ((x - centerX) / centerX) * 15;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    // Calculate angle for rainbow gradient rotation
    const angle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI);

    // Use CSS custom properties instead of state
    inner.style.setProperty('--rotate-x', `${rotateX}deg`);
    inner.style.setProperty('--rotate-y', `${rotateY}deg`);
    inner.style.setProperty('--glare-x', `${glareX}%`);
    inner.style.setProperty('--glare-y', `${glareY}%`);
    inner.style.setProperty('--glare-opacity', '1');
    inner.style.setProperty('--holo-angle', `${angle}deg`);
    inner.style.setProperty('--sparkle-opacity', '1');
  };

  const handleMouseLeave = () => {
    if (!innerRef.current) return;
    const inner = innerRef.current;

    inner.style.setProperty('--rotate-x', '0deg');
    inner.style.setProperty('--rotate-y', '0deg');
    inner.style.setProperty('--glare-x', '50%');
    inner.style.setProperty('--glare-y', '50%');
    inner.style.setProperty('--glare-opacity', '0');
    inner.style.setProperty('--holo-angle', '0deg');
    inner.style.setProperty('--sparkle-opacity', '0');
  };

  const thumbnailUrl = item.metadata.thumbnail?.relativePath || '';
  const hasThumbnail = !!thumbnailUrl;

  return (
    <Box
      className="HoloCard--root"
      ref={cardRef}
      {...fileSystemItem.itemProps}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      sx={{
        ...fileSystemItem.mergeStyles({}),
        width: 300,
        height: 380,
        perspective: 1000,
        cursor: 'pointer',
      }}
    >
      <Box
        ref={innerRef}
        data-augmented-ui={
          'tl-clip bl-clip br-clip tr-2-clip-x b-clip-x border'
        }
        sx={(theme) => ({
          '--aug-tr': '6px',
          '--aug-tl': '5px',
          '--aug-bl': '5px',
          '--aug-br': '5px',
          '--aug-b': '8px',
          '--aug-b-extend1': '25%',
          '--aug-border-all': '2px',
          '--aug-border-bg': !isSelected
            ? theme.palette.action.focus
            : theme.palette.primary.main,
          '&:hover': {
            '--aug-border-bg': theme.palette.secondary.main,
            transition: '--aug-border-bg 0s ease-in',
          },

          width: '100%',
          height: '100%',
          position: 'relative',
          transition: 'transform 0.1s ease-out --aug-border-bg 0.75s ease-out',
          transformStyle: 'preserve-3d',
          transform:
            'rotateX(var(--rotate-x, 0deg)) rotateY(var(--rotate-y, 0deg)) scale(1.02)',
          overflow: 'hidden',
          backgroundColor: 'background.paper',
          willChange: 'transform',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)',
            pointerEvents: 'none',
            zIndex: 10,
          },
        })}
      >
        {/* Main image */}
        <Box
          sx={{
            width: '100%',
            height: '70%',
            position: 'relative',
            backgroundColor: hasThumbnail ? 'transparent' : 'action.hover',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {hasThumbnail ? (
            <ImageContainer
              {...generateImageSources(thumbnailUrl, 'thumbnail')}
              skeletonSrc={thumbnailUrl}
              lazy={false}
              alt={item.name}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'brightness(1.1) contrast(1.05)',
              }}
            />
          ) : (
            <Box
              sx={{
                fontSize: 64,
                opacity: 0.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {item.icon}
            </Box>
          )}

          {/* Holographic rainbow overlay */}
          <Box
            className="HoloCard--holographic-overlay"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: `
                linear-gradient(
                  calc(var(--holo-angle, 0deg) + 90deg),
                  transparent 0%,
                  hsl(0, 100%, 70%) 5%,
                  hsl(30, 100%, 70%) 10%,
                  hsl(60, 100%, 70%) 15%,
                  hsl(90, 100%, 70%) 20%,
                  hsl(120, 100%, 70%) 25%,
                  hsl(150, 100%, 70%) 30%,
                  hsl(180, 100%, 70%) 35%,
                  hsl(210, 100%, 70%) 40%,
                  hsl(240, 100%, 70%) 45%,
                  hsl(270, 100%, 70%) 50%,
                  hsl(300, 100%, 70%) 55%,
                  hsl(330, 100%, 70%) 60%,
                  hsl(360, 100%, 70%) 65%,
                  transparent 70%
                )
              `,
              mixBlendMode: 'color-dodge',
              opacity: 'calc(var(--glare-opacity, 0) * 0.4)',
              backgroundSize: '300% 300%',
              backgroundPosition: 'var(--glare-x, 50%) var(--glare-y, 50%)',
              pointerEvents: 'none',
              transition: 'opacity 0.2s ease',
            }}
          />

          {/* Radial sparkle burst */}
          <Box
            className="HoloCard--sparkles"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: `
                radial-gradient(
                  circle at var(--glare-x, 50%) var(--glare-y, 50%),
                  rgba(255, 255, 255, 0.9) 0%,
                  rgba(255, 255, 255, 0.7) 1%,
                  transparent 4%
                ),
                radial-gradient(
                  circle at calc(var(--glare-x, 50%) + 15%) calc(var(--glare-y, 50%) - 10%),
                  rgba(255, 200, 255, 0.8) 0%,
                  transparent 2%
                ),
                radial-gradient(
                  circle at calc(var(--glare-x, 50%) - 20%) calc(var(--glare-y, 50%) + 15%),
                  rgba(200, 255, 255, 0.8) 0%,
                  transparent 2%
                ),
                radial-gradient(
                  circle at calc(var(--glare-x, 50%) + 25%) calc(var(--glare-y, 50%) + 25%),
                  rgba(255, 255, 200, 0.7) 0%,
                  transparent 1.5%
                ),
                radial-gradient(
                  circle at calc(var(--glare-x, 50%) - 15%) calc(var(--glare-y, 50%) - 20%),
                  rgba(255, 220, 255, 0.7) 0%,
                  transparent 1.5%
                )
              `,
              opacity: 'calc(var(--sparkle-opacity, 0) * 0.7)',
              transition: 'opacity 0.15s ease',
              pointerEvents: 'none',
              mixBlendMode: 'screen',
            }}
          />
        </Box>

        {/* Info section */}
        <Box
          sx={{
            height: '30%',
            padding: 1.5,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderTop: '1px solid',
            borderColor: 'divider',
            background: (theme) =>
              `linear-gradient(to bottom, ${theme.palette.background.paper}, ${theme.palette.action.hover})`,
          }}
        >
          <Box>
            <Typography
              variant="body2"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              {item.name}
              {item.metadata.favorite && (
                <Star
                  sx={{
                    color: 'warning.main',
                    fontSize: 14,
                    flexShrink: 0,
                  }}
                />
              )}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                maxHeight: 50,
              }}
            >
              {item.metadata.description}
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="caption" color="text.secondary">
              {item.dateModified.toLocaleDateString()}
            </Typography>
            {item.size && (
              <Typography variant="caption" color="text.secondary">
                {Math.round(item.size / 1024)} KB
              </Typography>
            )}
          </Box>
        </Box>

        {/* Diagonal rainbow streaks */}
        <Box
          className="HoloCard--rainbow-streaks"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: `
              repeating-linear-gradient(
                calc(var(--holo-angle, 0deg) + 45deg),
                transparent,
                rgba(255, 0, 0, 0.15) 2px,
                transparent 4px,
                rgba(255, 165, 0, 0.15) 6px,
                transparent 8px,
                rgba(255, 255, 0, 0.15) 10px,
                transparent 12px,
                rgba(0, 255, 0, 0.15) 14px,
                transparent 16px,
                rgba(0, 127, 255, 0.15) 18px,
                transparent 20px,
                rgba(139, 0, 255, 0.15) 22px,
                transparent 24px
              )
            `,
            backgroundSize: '600% 600%',
            backgroundPosition: 'var(--glare-x, 50%) var(--glare-y, 50%)',
            opacity: 'calc(var(--glare-opacity, 0) * 0.2)',
            transition: 'opacity 0.2s ease',
            mixBlendMode: 'color-dodge',
            pointerEvents: 'none',

            ...(hasThumbnail && {
              WebkitMaskImage: `url(${
                generateImageSources(thumbnailUrl, 'thumbnail').src ||
                thumbnailUrl
              })`,
              maskImage: `url(${
                generateImageSources(thumbnailUrl, 'thumbnail').src ||
                thumbnailUrl
              })`,
              WebkitMaskSize: 'cover',
              maskSize: 'cover',
              WebkitMaskPosition: 'center',
              maskPosition: 'center',
            }),
          }}
        />

        {/* Holographic grain texture overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(255,255,255,0.02) 0%, transparent 1%),
              radial-gradient(circle at 75% 25%, rgba(255,255,255,0.02) 0%, transparent 1%),
              radial-gradient(circle at 25% 75%, rgba(255,255,255,0.02) 0%, transparent 1%),
              radial-gradient(circle at 75% 75%, rgba(255,255,255,0.02) 0%, transparent 1%),
              radial-gradient(circle at 50% 50%, rgba(255,255,255,0.01) 0%, transparent 0.5%)
            `,
            backgroundSize: '4px 4px, 4px 4px, 4px 4px, 4px 4px, 2px 2px',
            backgroundPosition: '0 0, 2px 0, 0 2px, 2px 2px, 1px 1px',
            opacity: 'calc(var(--glare-opacity, 0) * 0.8)',
            mixBlendMode: 'overlay',
            pointerEvents: 'none',
            filter: 'contrast(1.5)',
          }}
        />
      </Box>
    </Box>
  );
};
