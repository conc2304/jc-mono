import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { GradientData } from './ColorGradientEditor';
import { PatternTypeSelector } from '../../molecules/pattern-type-selector';
import { GradientSwatchPicker } from '../../molecules/gradient-swatch-picker';
import { PatternConfiguration } from '../../molecules/pattern-configuration';
import { CustomGradientEditorModal } from '../../molecules/custom-gradient-editor-modal';
import {
  Gradient,
  GradientPatternType,
  InterpolationMode,
  GradientPatternConfig,
  ColorStop,
} from './types';

interface GradientPatternSelectorProps {
  gradients?: Gradient[];
  onPatternConfigChange?: (
    config: GradientPatternConfig,
    gradient: Gradient | null
  ) => void;
  activeGradient?: Gradient | null;
  activePatternConfig?: GradientPatternConfig | null;
}

export const GradientPatternSelector: React.FC<
  GradientPatternSelectorProps
> = ({
  gradients = [],
  onPatternConfigChange,
  activeGradient,
  activePatternConfig,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [savedGradients, setSavedGradients] = useState<Gradient[]>([]);
  const [customGradientStops, setCustomGradientStops] = useState<ColorStop[]>([
    { id: 1, color: '#FF0000', position: 0 },
    { id: 2, color: '#0000FF', position: 100 },
  ]);

  // Local pattern config state - defaults
  const [patternType, setPatternType] = useState<GradientPatternType | null>(
    activePatternConfig?.type || null
  );
  const [interpolation, setInterpolation] = useState<InterpolationMode>(
    activePatternConfig?.interpolation || 'linear'
  );
  const [speed, setSpeed] = useState<number>(activePatternConfig?.speed || 0);
  const [selectedGradient, setSelectedGradient] = useState<Gradient | null>(
    activeGradient || null
  );

  // Sync with parent component props
  useEffect(() => {
    setSelectedGradient(activeGradient || null);
  }, [activeGradient]);

  useEffect(() => {
    setPatternType(activePatternConfig?.type || null);
    setInterpolation(activePatternConfig?.interpolation || 'linear');
    setSpeed(activePatternConfig?.speed || 0);
  }, [activePatternConfig]);

  // Notify parent when config changes
  const notifyConfigChange = (
    newType: GradientPatternType,
    newInterpolation: InterpolationMode,
    newSpeed: number,
    gradient: Gradient | null
  ) => {
    if (onPatternConfigChange) {
      onPatternConfigChange(
        {
          type: newType,
          interpolation: newInterpolation,
          speed: newSpeed,
        },
        gradient
      );
    }
  };

  const handlePatternTypeSelect = (type: GradientPatternType): void => {
    setPatternType(type);
    notifyConfigChange(type, interpolation, speed, selectedGradient);
  };

  const handleGradientSelect = (gradient: Gradient): void => {
    setSelectedGradient(gradient);
    notifyConfigChange(
      patternType || 'horizontal',
      interpolation,
      speed,
      gradient
    );
  };

  const handleInterpolationChange = (
    _event: React.MouseEvent<HTMLElement>,
    newInterpolation: InterpolationMode | null
  ) => {
    if (newInterpolation !== null) {
      setInterpolation(newInterpolation);
      notifyConfigChange(
        patternType || 'horizontal',
        newInterpolation,
        speed,
        selectedGradient
      );
    }
  };

  const handleSpeedChange = (_event: Event, newSpeed: number | number[]) => {
    const speedValue = newSpeed as number;
    setSpeed(speedValue);
    notifyConfigChange(
      patternType || 'horizontal',
      interpolation,
      speedValue,
      selectedGradient
    );
  };

  const handleStaticClick = () => {
    setSpeed(0);
    notifyConfigChange(
      patternType || 'horizontal',
      interpolation,
      0,
      selectedGradient
    );
  };

  const handleSaveGradient = (): void => {
    const newGradient: Gradient = {
      id: `custom-${Date.now()}`,
      stops: customGradientStops,
    };

    if (
      !savedGradients.some(
        (g) => JSON.stringify(g.stops) === JSON.stringify(newGradient.stops)
      )
    ) {
      setSavedGradients([...savedGradients, newGradient]);
    }
    handleGradientSelect(newGradient);
    setIsModalOpen(false);
  };

  const handleRemoveSavedGradient = (gradientId: string): void => {
    setSavedGradients(savedGradients.filter((g) => g.id !== gradientId));
  };

  const handleGradientChange = (gradientData: GradientData): void => {
    setCustomGradientStops(gradientData.stops);
  };

  return (
    <Box sx={{ width: '100%', mx: 'auto', p: 2 }}>
      {/* Pattern Type Selection */}
      <PatternTypeSelector
        selectedPatternType={patternType}
        interpolation={interpolation}
        selectedGradientStops={selectedGradient?.stops}
        onPatternTypeSelect={handlePatternTypeSelect}
      />

      {/* Gradient Swatch Picker */}
      <GradientSwatchPicker
        gradients={gradients}
        savedGradients={savedGradients}
        selectedGradient={selectedGradient}
        onGradientSelect={handleGradientSelect}
        onRemoveSavedGradient={handleRemoveSavedGradient}
        onOpenCustomEditor={() => setIsModalOpen(true)}
      />

      {/* Pattern Configuration Controls */}
      <PatternConfiguration
        patternType={patternType}
        interpolation={interpolation}
        speed={speed}
        selectedGradientStops={selectedGradient?.stops}
        onInterpolationChange={handleInterpolationChange}
        onSpeedChange={handleSpeedChange}
        onStaticClick={handleStaticClick}
      />

      {/* Custom Gradient Editor Modal */}
      <CustomGradientEditorModal
        isOpen={isModalOpen}
        customGradientStops={customGradientStops}
        onClose={() => setIsModalOpen(false)}
        onGradientChange={handleGradientChange}
        onSaveGradient={handleSaveGradient}
      />
    </Box>
  );
};
