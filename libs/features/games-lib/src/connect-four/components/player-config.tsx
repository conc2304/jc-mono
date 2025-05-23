import { useState } from 'react';
import { ButtonGroup, Modal } from '@jc/ui-components';
import { Settings } from 'lucide-react';

import { PLAYER_TYPE } from '../constants';
import { Difficulty, PlayerType } from '../types';
import { AIDifficultyPanel } from './accordion-config-panel';
import { EvaluationConfig } from '../utils/evaluation-config';

interface PlayerConfigProps {
  playerNumber: number;
  color: string;
  onColorChange: (color: string) => void;
  playerType: PlayerType;
  onPlayerTypeChange: (value: PlayerType) => void;
  onAiConfigChange?: (config: EvaluationConfig, difficulty: Difficulty) => void;
  onPauseChange: (value: boolean) => void;
}

export const PlayerConfig = ({
  playerNumber,
  color,
  onColorChange,
  playerType,
  onPlayerTypeChange: onAiChange,
  onAiConfigChange,
  onPauseChange,
}: PlayerConfigProps) => {
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const handleAiConfigChange = (
    config: EvaluationConfig,
    difficulty: Difficulty
  ) => {
    onAiConfigChange?.(config, difficulty);
  };

  // const handlePauseChange = (value: boolean) => {
  //   onPauseChange?.(value);
  // };

  return (
    <>
      <div className="flex flex-col gap-4">
        <p className="text-center mb-2 font-medium text-gray-800">
          Player {playerNumber} Settings
        </p>

        <div className="flex items-center">
          <label
            htmlFor={`player${playerNumber}-color`}
            className="mr-2 text-sm font-medium text-gray-700"
          >
            Color:
          </label>
          <input
            type="color"
            id={`player${playerNumber}-color`}
            value={color}
            name={`player${playerNumber}-color`}
            onChange={(e) => onColorChange(e.target.value)}
            className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
          />
        </div>

        <div className="flex items-center">
          <label className="mr-2 text-sm font-medium text-gray-700">
            Type:
          </label>
          <ButtonGroup
            value={playerType}
            options={[
              { label: 'Human', value: PLAYER_TYPE.HUMAN },
              { label: 'Computer', value: PLAYER_TYPE.COMPUTER },
            ]}
            onChange={(value) => onAiChange(value as PlayerType)}
          />
        </div>

        {/* AI Configuration Button - Only show for Computer players */}
        {playerType === PLAYER_TYPE.COMPUTER && (
          <div className="flex items-center">
            <label className="mr-2 text-sm font-medium text-gray-700">
              AI Settings:
            </label>
            <button
              onClick={() => {
                onPauseChange(true);
                setIsAiModalOpen(true);
              }}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
            >
              <Settings className="w-4 h-4" />
              Configure AI
            </button>
          </div>
        )}
      </div>

      {/* AI Configuration Modal */}
      <Modal
        isOpen={isAiModalOpen}
        onClose={() => {
          setIsAiModalOpen(false);
          setTimeout(() => onPauseChange(false), 300);
        }}
        title={`Player ${playerNumber} AI Configuration`}
        maxWidth="lg"
      >
        <AIDifficultyPanel onConfigChange={handleAiConfigChange} />
      </Modal>
    </>
  );
};
