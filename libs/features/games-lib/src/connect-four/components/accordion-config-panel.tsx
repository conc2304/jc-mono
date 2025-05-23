import { useState } from 'react';
import { formatLabel } from '@jc/utils';
import { RotateCcw } from 'lucide-react';

import { ConfigSection } from './config-section';
import { Difficulty } from '../types';
import { EvaluationConfig } from '../utils/evaluation-config';
import { DIFFICULTY_CONFIGS } from '../utils/evaluation-config';

interface AIDifficultyPanelProps {
  onConfigChange?: (config: EvaluationConfig, difficulty: Difficulty) => void;
}

export const AIDifficultyPanel = ({
  onConfigChange,
}: AIDifficultyPanelProps) => {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [config, setConfig] = useState<EvaluationConfig>(
    DIFFICULTY_CONFIGS.medium
  );
  const [openAccordions, setOpenAccordions] = useState<Set<string>>(
    new Set(['terminal'])
  );

  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
    if (newDifficulty !== 'custom') {
      const newConfig = DIFFICULTY_CONFIGS[newDifficulty];
      setConfig(newConfig);
      onConfigChange?.(newConfig, newDifficulty);
    }
  };

  const updateConfig = (
    section: keyof EvaluationConfig,
    field: string,
    value: number
  ) => {
    const newConfig = {
      ...config,
      [section]: { ...config[section], [field]: value },
    };
    setConfig(newConfig);

    if (difficulty !== 'custom') {
      setDifficulty('custom');
    }
    onConfigChange?.(newConfig, 'custom');
  };

  const resetToDefault = () => {
    setConfig(DIFFICULTY_CONFIGS.medium);
    setDifficulty('medium');
    onConfigChange?.(DIFFICULTY_CONFIGS.medium, 'medium');
  };

  const toggleAccordion = (section: string) => {
    setOpenAccordions((prev: Set<string>) => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">AI Configuration</h2>
        <button
          onClick={resetToDefault}
          className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          title="Reset to defaults"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Difficulty Level:
        </label>
        <div className="grid grid-cols-2 gap-2">
          {(['easy', 'medium', 'hard', 'custom'] as const).map((level) => (
            <button
              key={level}
              onClick={() => handleDifficultyChange(level)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                difficulty === level
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div>
        {Object.entries(config).map(([sectionKey, sectionConfig]) => (
          <ConfigSection
            key={sectionKey}
            title={formatLabel(sectionKey)}
            sectionKey={sectionKey}
            config={sectionConfig as Record<string, number>}
            onUpdate={(field, value) =>
              updateConfig(sectionKey as keyof EvaluationConfig, field, value)
            }
            isOpen={openAccordions.has(sectionKey)}
            onToggle={() => toggleAccordion(sectionKey)}
          />
        ))}
      </div>
    </div>
  );
};
