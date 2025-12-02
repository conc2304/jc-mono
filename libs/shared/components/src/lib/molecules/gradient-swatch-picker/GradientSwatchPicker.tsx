import { Box } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import {
  Gradient,
  ColorStop,
} from '../../organisms/color-gradient-editor/types';
import { SwatchItem, SwatchPicker } from '../../organisms/swatch-picker';
import { AugmentedButton } from '../../atoms';

interface GradientSwatchPickerProps {
  gradients: Gradient[];
  savedGradients: Gradient[];
  selectedGradient: Gradient | null;
  onGradientSelect: (gradient: Gradient) => void;
  onRemoveSavedGradient: (gradientId: string) => void;
  onOpenCustomEditor: () => void;
}

// Generate CSS gradient string from stops
const generateGradientCSS = (stops: ColorStop[]): string => {
  const sortedStops = [...stops].sort((a, b) => a.position - b.position);
  const gradientString = sortedStops
    .map((stop) => `${stop.color} ${stop.position}%`)
    .join(', ');
  return `linear-gradient(to right, ${gradientString})`;
};

export const GradientSwatchPicker = ({
  gradients,
  savedGradients,
  selectedGradient,
  onGradientSelect,
  onRemoveSavedGradient,
  onOpenCustomEditor,
}: GradientSwatchPickerProps) => {
  const theme = useTheme();

  // Convert gradients to SwatchItem format
  const gradientItems: SwatchItem<Gradient>[] = gradients.map((gradient) => ({
    id: gradient.id,
    value: gradient,
    display: generateGradientCSS(gradient.stops),
    isGradient: true,
  }));

  const savedGradientItems: SwatchItem<Gradient>[] = savedGradients.map(
    (gradient) => ({
      id: gradient.id,
      value: gradient,
      display: generateGradientCSS(gradient.stops),
      isGradient: true,
    })
  );

  const activeGradientItem: SwatchItem<Gradient> | null = selectedGradient
    ? {
        id: selectedGradient.id,
        value: selectedGradient,
        display: generateGradientCSS(selectedGradient.stops),
        isGradient: true,
      }
    : null;

  const handleGradientSelect = (item: SwatchItem<Gradient>): void => {
    onGradientSelect(item.value);
  };

  const customButton = (
    <AugmentedButton
      onClick={onOpenCustomEditor}
      color="primary"
      variant="outlined"
      sx={{
        width: 140,
        height: 64,
        p: 0,
      }}
    >
      <AddIcon sx={{ color: theme.palette.text.secondary, fontSize: 32 }} />
    </AugmentedButton>
  );

  return (
    <Box sx={{ mb: 3 }}>
      <SwatchPicker
        title="Gradient Colors"
        items={gradientItems}
        savedItems={savedGradientItems}
        savedItemsTitle="Saved Gradients"
        activeItem={activeGradientItem}
        onItemSelect={handleGradientSelect}
        onRemoveSavedItem={onRemoveSavedGradient}
        customButton={customButton}
        size="large"
        gridColumns={{ xs: 2, sm: 3, md: 4, lg: 9 }}
      />
    </Box>
  );
};
