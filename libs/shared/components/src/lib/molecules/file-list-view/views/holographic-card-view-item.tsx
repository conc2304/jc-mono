import { useContext, useRef } from 'react';
import { Box, Divider, Typography } from '@mui/material';
import { Star } from '@mui/icons-material';

import { FileListItemProps } from './types';
import { FileSystemContext, useMediaProvider } from '../../../context';
import { useFileSystemItem } from '../../../hooks/use-file-list-item';
import { ImageContainer } from '../../../atoms';

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

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    // Use CSS custom properties instead of state
    inner.style.setProperty('--rotate-x', `${rotateX}deg`);
    inner.style.setProperty('--rotate-y', `${rotateY}deg`);
    inner.style.setProperty('--glare-x', `${glareX}%`);
    inner.style.setProperty('--glare-y', `${glareY}%`);
    inner.style.setProperty('--glare-opacity', '0.3');
  };

  const handleMouseLeave = () => {
    if (!innerRef.current) return;
    const inner = innerRef.current;

    inner.style.setProperty('--rotate-x', '0deg');
    inner.style.setProperty('--rotate-y', '0deg');
    inner.style.setProperty('--glare-x', '50%');
    inner.style.setProperty('--glare-y', '50%');
    inner.style.setProperty('--glare-opacity', '0');
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
        sx={{
          width: '100%',
          height: '100%',
          position: 'relative',
          borderRadius: 2,
          transition: 'transform 0.1s ease-out, box-shadow 0.3s ease-out',
          transformStyle: 'preserve-3d',
          transform:
            'rotateX(var(--rotate-x, 0deg)) rotateY(var(--rotate-y, 0deg))',
          boxShadow: isSelected
            ? '0 10px 30px rgba(0, 123, 255, 0.5), 0 0 20px rgba(0, 123, 255, 0.3)'
            : '0 5px 15px rgba(0, 0, 0, 0.3)',
          border: isSelected ? '2px solid' : '1px solid',
          borderColor: isSelected ? 'primary.main' : 'divider',
          overflow: 'hidden',
          backgroundColor: 'background.paper',
          willChange: 'transform',
        }}
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

          {/* Holographic overlay */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: `
                radial-gradient(
                  circle at var(--glare-x, 50%) var(--glare-y, 50%),
                  rgba(255, 255, 255, var(--glare-opacity, 0)),
                  transparent 50%
                ),
                linear-gradient(
                  115deg,
                  transparent 20%,
                  rgba(255, 0, 255, 0.1) 36%,
                  rgba(0, 255, 255, 0.1) 43%,
                  rgba(0, 255, 0, 0.1) 50%,
                  rgba(255, 255, 0, 0.1) 57%,
                  rgba(255, 0, 0, 0.1) 64%,
                  transparent 80%
                )
              `,
              mixBlendMode: 'color-dodge',
              opacity: 0.5,
              backgroundSize: '200% 200%',
              backgroundPosition: 'var(--glare-x, 50%) var(--glare-y, 50%)',
              pointerEvents: 'none',
            }}
          />

          {/* Sparkle effect */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: `
                radial-gradient(
                  circle at var(--glare-x, 50%) var(--glare-y, 50%),
                  rgba(255, 255, 255, 0.8) 0%,
                  transparent 3%
                ),
                radial-gradient(
                  circle at calc(var(--glare-x, 50%) + 20%) calc(var(--glare-y, 50%) + 30%),
                  rgba(255, 255, 255, 0.6) 0%,
                  transparent 2%
                ),
                radial-gradient(
                  circle at calc(var(--glare-x, 50%) + 40%) calc(var(--glare-y, 50%) + 10%),
                  rgba(255, 255, 255, 0.5) 0%,
                  transparent 2%
                )
              `,
              opacity: 'var(--glare-opacity, 0)',
              transition: 'opacity 0.2s ease',
              pointerEvents: 'none',
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
                fontWeight: 600,
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

        {/* Rainbow reflection layer */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: `
              repeating-linear-gradient(
                0deg,
                rgba(255, 119, 115, 0.05) 0%,
                rgba(255, 237, 95, 0.05) 10%,
                rgba(168, 255, 95, 0.05) 20%,
                rgba(131, 255, 247, 0.05) 30%,
                rgba(120, 148, 255, 0.05) 40%,
                rgba(216, 117, 255, 0.05) 50%,
                rgba(255, 119, 115, 0.05) 60%
              )
            `,
            backgroundSize: '200% 100%',
            backgroundPosition: 'var(--glare-x, 50%) 0%',
            opacity: 'calc(var(--glare-opacity, 0) * 1)',
            transition: 'opacity 0.2s ease',
            mixBlendMode: 'overlay',
            pointerEvents: 'none',
          }}
        />
      </Box>
    </Box>
  );
};
