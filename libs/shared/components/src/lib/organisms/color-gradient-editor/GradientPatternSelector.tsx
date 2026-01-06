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
  SpeedDirection,
  WaveConfig,
} from '@jc/utils';

interface GradientPatternSelectorProps {
  gradients?: Gradient[];
  onPatternConfigChange?: (
    config: GradientPatternConfig,
    gradient: Gradient | null
  ) => void;
  activeGradient?: Gradient | null;
  activePatternConfig?: GradientPatternConfig | null;
  savedGradients?: Gradient[];
  onAddGradient?: (gradient: Gradient) => void;
  onRemoveGradient?: (gradientId: string) => void;
}

export const GradientPatternSelector: React.FC<
  GradientPatternSelectorProps
> = ({
  gradients = [],
  onPatternConfigChange,
  activeGradient,
  activePatternConfig,
  savedGradients = [],
  onAddGradient,
  onRemoveGradient,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [customGradientStops, setCustomGradientStops] = useState<ColorStop[]>([
    { id: 0, color: '#FF0000', position: 0 },
    { id: 1, color: '#000000', position: 50 },
    { id: 2, color: '#0000FF', position: 100 },
  ]);
  const [editingGradient, setEditingGradient] = useState<Gradient | null>(null);

  // Local pattern config state - defaults
  const [patternType, setPatternType] = useState<GradientPatternType | null>(
    activePatternConfig?.type || null
  );
  const [interpolation, setInterpolation] = useState<InterpolationMode>(
    activePatternConfig?.interpolation || 'linear'
  );
  const [speed, setSpeed] = useState<number>(
    Math.abs(activePatternConfig?.speed || 0)
  );
  const [direction, setDirection] = useState<SpeedDirection>(
    activePatternConfig?.direction || 'forward'
  );
  const [period, setPeriod] = useState<number>(
    activePatternConfig?.period || 1
  );
  const [waveConfig, setWaveConfig] = useState<WaveConfig>(
    activePatternConfig?.wave || { type: null, period: 1, amplitude: 0.5 }
  );
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
    setSpeed(Math.abs(activePatternConfig?.speed || 0));
    setDirection(activePatternConfig?.direction || 'forward');
    setPeriod(activePatternConfig?.period || 1);
    setWaveConfig(
      activePatternConfig?.wave || { type: null, period: 1, amplitude: 0.5 }
    );
  }, [activePatternConfig]);

  // Notify parent when config changes
  const notifyConfigChange = (
    newType: GradientPatternType,
    newInterpolation: InterpolationMode,
    newSpeed: number,
    newDirection: SpeedDirection,
    newPeriod: number,
    newWaveConfig: WaveConfig,
    gradient: Gradient | null
  ) => {
    if (onPatternConfigChange) {
      onPatternConfigChange(
        {
          type: newType,
          interpolation: newInterpolation,
          speed: newSpeed,
          direction: newDirection,
          period: newPeriod,
          wave: newWaveConfig,
        },
        gradient
      );
    }
  };

  const handlePatternTypeSelect = (type: GradientPatternType): void => {
    setPatternType(type);
    notifyConfigChange(
      type,
      interpolation,
      speed,
      direction,
      period,
      waveConfig,
      selectedGradient
    );
  };

  const handleGradientSelect = (gradient: Gradient): void => {
    setSelectedGradient(gradient);
    notifyConfigChange(
      patternType || 'horizontal',
      interpolation,
      speed,
      direction,
      period,
      waveConfig,
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
        direction,
        period,
        waveConfig,
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
      direction,
      period,
      waveConfig,
      selectedGradient
    );
  };

  const handleStaticClick = () => {
    setSpeed(0);
    notifyConfigChange(
      patternType || 'horizontal',
      interpolation,
      0,
      direction,
      period,
      waveConfig,
      selectedGradient
    );
  };

  const handleDirectionChange = (newDirection: SpeedDirection) => {
    setDirection(newDirection);
    // Multiply speed by -1 when changing direction to backward, by 1 for forward
    const adjustedSpeed =
      newDirection === 'backward' ? -Math.abs(speed) : Math.abs(speed);
    notifyConfigChange(
      patternType || 'horizontal',
      interpolation,
      adjustedSpeed,
      newDirection,
      period,
      waveConfig,
      selectedGradient
    );
  };

  const handlePeriodChange = (_event: Event, newPeriod: number | number[]) => {
    const periodValue = newPeriod as number;
    setPeriod(periodValue);
    notifyConfigChange(
      patternType || 'horizontal',
      interpolation,
      speed,
      direction,
      periodValue,
      waveConfig,
      selectedGradient
    );
  };

  const handleWaveConfigChange = (newWaveConfig: WaveConfig) => {
    setWaveConfig(newWaveConfig);
    notifyConfigChange(
      patternType || 'horizontal',
      interpolation,
      speed,
      direction,
      period,
      newWaveConfig,
      selectedGradient
    );
  };

  const handleSaveGradient = (): void => {
    const newGradient: Gradient = {
      id: `custom-${Date.now()}`,
      stops: customGradientStops,
      isDefault: false,
    };

    if (
      !savedGradients.some(
        (g) => JSON.stringify(g.stops) === JSON.stringify(newGradient.stops)
      )
    ) {
      onAddGradient?.(newGradient);
    }
    handleGradientSelect(newGradient);
    setEditingGradient(null);
    setIsModalOpen(false);
  };

  const handleUpdateGradient = (gradientId: string): void => {
    const updatedGradient: Gradient = {
      id: gradientId,
      stops: customGradientStops,
      isDefault: false,
    };

    onAddGradient?.(updatedGradient);
    handleGradientSelect(updatedGradient);
    setEditingGradient(null);
    setIsModalOpen(false);
  };

  const handleEditGradient = (gradient: Gradient): void => {
    setCustomGradientStops(gradient.stops);
    setEditingGradient(gradient);
    setIsModalOpen(true);
  };

  const handleDuplicateGradient = (gradient: Gradient): void => {
    const duplicatedGradient: Gradient = {
      id: `custom-${Date.now()}`,
      stops: gradient.stops,
      isDefault: false,
    };
    onAddGradient?.(duplicatedGradient);
    handleGradientSelect(duplicatedGradient);
  };

  const handleOpenCustomEditor = (): void => {
    setCustomGradientStops([
      { id: 0, color: '#FF0000', position: 0 },
      { id: 1, color: '#000000', position: 50 },
      { id: 2, color: '#0000FF', position: 100 },
    ]);
    setEditingGradient(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = (): void => {
    setEditingGradient(null);
    setIsModalOpen(false);
  };

  const handleRemoveSavedGradient = (gradientId: string): void => {
    onRemoveGradient?.(gradientId);
  };

  const handleGradientChange = (gradientData: GradientData): void => {
    setCustomGradientStops(gradientData.stops);
  };

  return (
    <Box sx={{ width: '100%', mx: 'auto' }}>
      {/* Pattern Type Selection */}
      <Box mx={1}>
        <PatternTypeSelector
          selectedPatternType={patternType}
          interpolation={interpolation}
          selectedGradientStops={selectedGradient?.stops}
          onPatternTypeSelect={handlePatternTypeSelect}
        />
      </Box>

      {/* Gradient Swatch Picker */}
      <GradientSwatchPicker
        gradients={gradients}
        savedGradients={savedGradients}
        selectedGradient={selectedGradient}
        onGradientSelect={handleGradientSelect}
        onRemoveSavedGradient={handleRemoveSavedGradient}
        onOpenCustomEditor={handleOpenCustomEditor}
        onEditGradient={handleEditGradient}
        onDuplicateGradient={handleDuplicateGradient}
      />

      {/* Pattern Configuration Controls */}
      <PatternConfiguration
        patternType={patternType}
        interpolation={interpolation}
        speed={speed}
        direction={direction}
        period={period}
        selectedGradientStops={selectedGradient?.stops}
        waveConfig={waveConfig}
        onInterpolationChange={handleInterpolationChange}
        onSpeedChange={handleSpeedChange}
        onStaticClick={handleStaticClick}
        onDirectionChange={handleDirectionChange}
        onPeriodChange={handlePeriodChange}
        onWaveConfigChange={handleWaveConfigChange}
      />

      {/* Custom Gradient Editor Modal */}
      <CustomGradientEditorModal
        isOpen={isModalOpen}
        customGradientStops={customGradientStops}
        editingGradient={editingGradient}
        onClose={handleCloseModal}
        onGradientChange={handleGradientChange}
        onSaveGradient={handleSaveGradient}
        onUpdateGradient={handleUpdateGradient}
      />
    </Box>
  );
};
