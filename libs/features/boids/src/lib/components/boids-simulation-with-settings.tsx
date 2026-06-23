import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react';

import type { BoidsApp } from '../core/boids-app';
import type { BoidsSimulationProps } from '../types';
import { BoidsSettingsPanel } from './boids-settings-panel';
import { BoidsSimulation } from './boids-simulation';

export type BoidsSimulationHandle = {
  getApp: () => BoidsApp | null;
};

export type BoidsSimulationWithSettingsProps = BoidsSimulationProps;

export const BoidsSimulationWithSettings = forwardRef<
  BoidsSimulationHandle,
  BoidsSimulationWithSettingsProps
>(function BoidsSimulationWithSettings(
  { showSettings = true, ...simulationProps },
  ref
) {
  const appRef = useRef<BoidsApp | null>(null);
  const [app, setApp] = useState<BoidsApp | null>(null);

  useImperativeHandle(ref, () => ({
    getApp: () => appRef.current,
  }));

  const handleAppReady = useCallback((readyApp: BoidsApp) => {
    appRef.current = readyApp;
    setApp(readyApp);
  }, []);

  return (
    <>
      <BoidsSimulation {...simulationProps} onAppReady={handleAppReady} />
      {showSettings && <BoidsSettingsPanel app={app} />}
    </>
  );
});
