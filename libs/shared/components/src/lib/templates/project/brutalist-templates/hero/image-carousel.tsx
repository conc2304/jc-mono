import React from 'react';
import { Box, alpha, useTheme } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { AugmentedIconButton } from '../../../../atoms';

interface Screenshot {
  url: string;
  alt: string;
  caption?: string;
}

interface ImageCarouselProps {
  screenshots: Screenshot[];
  activeIndex: number;
  onIndexChange: (index: number) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({
  screenshots,
  activeIndex,
  onIndexChange,
  onNext,
  onPrev,
}) => {
  const theme = useTheme();

  if (screenshots.length <= 1) return null;

  return (
    <>
      {/* Navigation Arrows - Desktop Only */}
      <AugmentedIconButton
        onClick={onPrev}
        className="desktop-layout"
        borderSize={0.5}
        sx={{
          zIndex: 10,
          position: 'absolute',
          left: 16,
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      >
        <ChevronLeft sx={{ pt: 0.75 }} />
      </AugmentedIconButton>
      <AugmentedIconButton
        onClick={onNext}
        className="desktop-layout"
        borderSize={0.5}
        sx={{
          zIndex: 10,
          position: 'absolute',
          right: 16,
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      >
        <ChevronRight sx={{ pt: 0.75 }} />
      </AugmentedIconButton>

      {/* Image Indicators */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 1,
        }}
      >
        {screenshots.map((_, index) => (
          <Box
            key={index}
            component="button"
            onClick={() => onIndexChange(index)}
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              border: 'none',
              backgroundColor:
                index === activeIndex
                  ? theme.palette.error.main
                  : alpha(theme.palette.error.main, 0.5),
              cursor: 'pointer',
              transition: 'background-color 0.3s',
            }}
          />
        ))}
      </Box>
    </>
  );
};
