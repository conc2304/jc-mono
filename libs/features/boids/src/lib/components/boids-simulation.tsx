import { useEffect, useMemo, useRef } from 'react';

import { BoidsApp } from '../core/boids-app';
import type { BoidsSimulationProps } from '../types';

export type BoidsSimulationComponentProps = BoidsSimulationProps & {
  onAppReady?: (app: BoidsApp) => void;
};

export function BoidsSimulation({
  physics = false,
  debug = false,
  boidCount = 250,
  attractorCount = 15,
  gridColors,
  obstacles = 'none',
  obstacleCount = 8,
  obstaclesEnabled = false,
  enableViewControls = false,
  attractorMotion,
  fieldMode,
  flowFieldPreset,
  boidMix,
  scenePreset,
  onAppReady,
  className,
  style,
}: BoidsSimulationComponentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const debugRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<BoidsApp | null>(null);
  const onAppReadyRef = useRef(onAppReady);
  onAppReadyRef.current = onAppReady;

  const resolvedGridColors = useMemo(
    () =>
      gridColors ?? {
        gridColor: '#00ffff',
        centerColor: '#ff00ff',
      },
    [gridColors?.gridColor, gridColors?.centerColor]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const app = new BoidsApp(container, {
      physics,
      debug,
      boidCount,
      attractorCount,
      gridColors: resolvedGridColors,
      obstacles,
      obstacleCount,
      obstaclesEnabled,
      enableViewControls,
      attractorMotion,
      fieldMode,
      flowFieldPreset,
      boidMix,
      scenePreset,
      debugContainer: debug ? debugRef.current : null,
      statsContainer: debug ? statsRef.current : null,
    });

    appRef.current = app;
    void app.init().then(() => {
      onAppReadyRef.current?.(app);
    });

    return () => {
      app.destroy();
      appRef.current = null;
    };
  }, [
    physics,
    debug,
    boidCount,
    attractorCount,
    obstacles,
    obstacleCount,
    enableViewControls,
    attractorMotion,
    fieldMode,
    flowFieldPreset,
    scenePreset,
  ]);

  useEffect(() => {
    appRef.current?.setGridColors(resolvedGridColors);
  }, [resolvedGridColors]);

  useEffect(() => {
    appRef.current?.setObstaclesEnabled(obstaclesEnabled);
  }, [obstaclesEnabled]);

  return (
    <div
      data-testid="boids-simulation"
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        ...style,
      }}
    >
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      {debug && (
        <>
          <div
            ref={statsRef}
            style={{
              position: 'absolute',
              top: 8,
              left: 8,
              zIndex: 2,
            }}
          />
          <div
            ref={debugRef}
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              zIndex: 2,
              maxHeight: '90%',
              overflow: 'auto',
            }}
          />
        </>
      )}
    </div>
  );
}
