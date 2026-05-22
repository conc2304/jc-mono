import { useCallback } from 'react';
import type { PresetSummary } from '@jc/shared/of-control-protocol';
import { useOFClient } from './OFClientContext';
import { useOFStore } from './useOFStore';
import { v4 as uuidv4 } from 'uuid';

export interface UsePresetsResult {
  presets: PresetSummary[];
  currentPreset: string | null;
  activeMode: string | null;
  optimisticMode: string | undefined;
  presetLoadingId: string | undefined;
  presetError: string | undefined;
  loadPreset: (presetId: string, options?: { switchMode?: boolean }) => Promise<void>;
  getPresets: () => void;
  clearPresetError: () => void;
}

export function usePresets(): UsePresetsResult {
  const { client, store } = useOFClient();
  const storeState = useOFStore();

  const loadPreset = useCallback(
    async (presetId: string, options?: { switchMode?: boolean }) => {
      const requestId = uuidv4();
      store.setPresetLoading(presetId);
      try {
        const response = await client.sendWithAck(
          { type: 'loadPreset', presetId, requestId, switchMode: options?.switchMode },
          5000
        );
        if (response.type === 'ack' && !response.ok) {
          store.clearOptimisticMode();
          store.setPresetError(response.error ?? 'Failed to load preset');
        }
        // On success: presetLoaded broadcast updates currentPreset + optimisticMode via store handler
      } catch {
        store.clearOptimisticMode();
        store.setPresetError('Request timed out');
      }
    },
    [client, store]
  );

  const getPresets = useCallback(() => {
    client.send({ type: 'getPresets' });
  }, [client]);

  const clearPresetError = useCallback(() => {
    store.clearPresetError();
  }, [store]);

  return {
    presets: storeState.presets,
    currentPreset: storeState.currentPreset,
    activeMode: storeState.currentMode,
    optimisticMode: storeState.optimisticMode,
    presetLoadingId: storeState.presetLoadingId,
    presetError: storeState.presetError,
    loadPreset,
    getPresets,
    clearPresetError,
  };
}
