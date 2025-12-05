import { ReactNode } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ColorSwatch } from '../../atoms';

export interface SwatchItem<T = string> {
  id: string;
  value: T;
  display: string; // CSS color or gradient string
  isGradient?: boolean;
  customActions?: React.ReactNode;
}

interface SwatchPickerProps<T = string> {
  title: string;
  items: SwatchItem<T>[];
  savedItems?: SwatchItem<T>[];
  savedItemsTitle?: string;
  activeItem?: SwatchItem<T> | null;
  onItemSelect: (item: SwatchItem<T>) => void;
  onRemoveSavedItem?: (itemId: string) => void;
  customButton?: ReactNode;
  size?: 'small' | 'medium' | 'large';
  gridColumns?: {
    xs: number;
    sm: number;
    md: number;
    lg?: number;
  };
}

export const SwatchPicker = <T,>({
  title,
  items,
  savedItems = [],
  savedItemsTitle = 'Saved',
  activeItem,
  onItemSelect,
  onRemoveSavedItem,
  customButton,
  size = 'medium',
  gridColumns = { xs: 3, sm: 4, md: 6, lg: 8 },
}: SwatchPickerProps<T>) => {
  const theme = useTheme();

  const renderSwatchGrid = (
    swatches: SwatchItem<T>[],
    showRemoveButton = false,
    hasAddSwatchButton = false
  ) => (
    <Box
      className="SwatchPicker--swatch-grid"
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: `repeat(${gridColumns.xs}, 1fr)`,
          sm: `repeat(${gridColumns.sm}, 1fr)`,
          md: `repeat(${gridColumns.md}, 1fr)`,
          ...(gridColumns.lg && { lg: `repeat(${gridColumns.lg}, 1fr)` }),
        },
        gap: 1,
      }}
    >
      {hasAddSwatchButton && customButton && customButton}

      {swatches.map((swatch) => (
        <Box
          key={swatch.id}
          sx={{
            position: 'relative',
            '&:hover .remove-btn': { opacity: 1 },
            '&:hover .action-btn': { opacity: 1 },
          }}
        >
          <ColorSwatch
            color={!swatch.isGradient ? swatch.display : undefined}
            gradient={swatch.isGradient ? swatch.display : undefined}
            onClick={() => onItemSelect(swatch)}
            isActive={activeItem?.id === swatch.id}
            size={size}
            tooltip={`Click to apply ${
              swatch.isGradient ? 'gradient' : 'color'
            }`}
          />
          {swatch.customActions}
          {!swatch.customActions && showRemoveButton && onRemoveSavedItem && (
            <IconButton
              className="remove-btn"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveSavedItem(swatch.id);
              }}
              sx={{
                position: 'absolute',
                top: -4,
                right: -4,
                width: 20,
                height: 20,
                backgroundColor: theme.palette.error.main,
                color: theme.palette.error.contrastText,
                opacity: 0,
                transition: 'opacity 0.2s',
                fontSize: '0.75rem',
                '&:hover': {
                  backgroundColor: theme.palette.error.dark,
                },
              }}
            >
              ×
            </IconButton>
          )}
        </Box>
      ))}
    </Box>
  );

  const renderSwatchScroll = (
    swatches: SwatchItem<T>[],
    showRemoveButton = false,
    hasAddSwatchButton = false
  ) => (
    <Box
      sx={{
        display: 'grid',
        gridTemplateRows: 'repeat(2, 1fr)',
        gridAutoFlow: 'column',
        gridAutoColumns: 'min-content',
        gap: 1,
        overflowX: 'auto',
        overflowY: 'hidden',
        pb: 1,
        '&::-webkit-scrollbar': {
          height: 6,
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: theme.palette.divider,
          borderRadius: 3,
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: theme.palette.primary.main,
          borderRadius: 3,
          '&:hover': {
            backgroundColor: theme.palette.primary.dark,
          },
        },
      }}
    >
      {hasAddSwatchButton && customButton && customButton}

      {swatches.map((swatch) => (
        <Box
          key={swatch.id}
          sx={{
            position: 'relative',
            '&:hover .remove-btn': { opacity: 1 },
            '&:hover .action-btn': { opacity: 1 },
          }}
        >
          <ColorSwatch
            color={!swatch.isGradient ? swatch.display : undefined}
            gradient={swatch.isGradient ? swatch.display : undefined}
            onClick={() => onItemSelect(swatch)}
            isActive={activeItem?.id === swatch.id}
            size={size}
            tooltip={`Click to apply ${
              swatch.isGradient ? 'gradient' : 'color'
            }`}
          />
          {swatch.customActions}
          {!swatch.customActions && showRemoveButton && onRemoveSavedItem && (
            <IconButton
              className="remove-btn"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveSavedItem(swatch.id);
              }}
              sx={{
                position: 'absolute',
                top: -4,
                right: -4,
                width: 20,
                height: 20,
                backgroundColor: theme.palette.error.main,
                color: theme.palette.error.contrastText,
                opacity: 0,
                transition: 'opacity 0.2s',
                fontSize: '0.75rem',
                '&:hover': {
                  backgroundColor: theme.palette.error.dark,
                },
              }}
            >
              ×
            </IconButton>
          )}
        </Box>
      ))}
    </Box>
  );

  return (
    <Box className="SwatchPicker--root">
      {/* Saved Items Section */}
      {savedItems.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="body2"
            fontWeight={600}
            color="text.primary"
            sx={{ mb: 1 }}
          >
            {savedItemsTitle}
          </Typography>
          <Box
            sx={{
              display: { xs: 'block', md: 'block' },
            }}
          >
            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
              {renderSwatchScroll(savedItems, true)}
            </Box>
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              {renderSwatchGrid(savedItems, true, false)}
            </Box>
          </Box>
        </Box>
      )}

      {/* Main Items Section */}
      <Typography
        variant="body2"
        fontWeight={600}
        color="text.primary"
        sx={{ mb: 1 }}
      >
        {title}
      </Typography>
      <Box
        sx={{
          display: { xs: 'block', md: 'block' },
        }}
      >
        {/* Mobile: Horizontal Scroll */}
        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
          {/* <Box
            sx={{
              display: 'grid',
              gridTemplateRows: 'repeat(2, 1fr)',
              gridAutoFlow: 'column',
              gridAutoColumns: 'min-content',
              gap: 1,
              overflowX: 'auto',
              overflowY: 'hidden',
              pb: 1,
              '&::-webkit-scrollbar': {
                height: 6,
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: theme.palette.divider,
                borderRadius: 3,
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: theme.palette.primary.main,
                borderRadius: 3,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                },
              },
            }}
          >
            {customButton && <Box>{customButton}</Box>}
            {items.map((swatch) => (
              <ColorSwatch
                key={swatch.id}
                color={!swatch.isGradient ? swatch.display : undefined}
                gradient={swatch.isGradient ? swatch.display : undefined}
                onClick={() => onItemSelect(swatch)}
                isActive={activeItem?.id === swatch.id}
                size={size}
                tooltip={`Click to apply ${
                  swatch.isGradient ? 'gradient' : 'color'
                }`}
              />
            ))}
          </Box> */}
          {renderSwatchScroll(items, false, true)}
        </Box>

        {/* Desktop: Grid */}
        <Box
          className="SwatchPicker--desktop-grid"
          sx={{ display: { xs: 'none', md: 'block' } }}
        >
          {renderSwatchGrid(items, false, true)}
          {/* <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: `repeat(${gridColumns.xs}, 1fr)`,
                sm: `repeat(${gridColumns.sm}, 1fr)`,
                md: `repeat(${gridColumns.md}, 1fr)`,
                ...(gridColumns.lg && { lg: `repeat(${gridColumns.lg}, 1fr)` }),
              },
              gap: 1,
            }}
          >
            {customButton && customButton}
            {items.map((swatch) => (
              <ColorSwatch
                key={swatch.id}
                color={!swatch.isGradient ? swatch.display : undefined}
                gradient={swatch.isGradient ? swatch.display : undefined}
                onClick={() => onItemSelect(swatch)}
                isActive={activeItem?.id === swatch.id}
                size={size}
                tooltip={`Click to apply ${
                  swatch.isGradient ? 'gradient' : 'color'
                }`}
              />
            ))}
          </Box> */}
        </Box>
      </Box>
    </Box>
  );
};
