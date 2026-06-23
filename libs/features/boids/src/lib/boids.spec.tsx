import { render, screen } from '@testing-library/react';

import { BoidsSimulation } from './components/boids-simulation';
import { BoidsApp } from './core/boids-app';

jest.mock('./core/boids-app', () => ({
  BoidsApp: jest.fn().mockImplementation(() => ({
    init: jest.fn().mockResolvedValue(undefined),
    destroy: jest.fn(),
    setGridColors: jest.fn(),
    setObstaclesEnabled: jest.fn(),
    getPresetState: jest.fn().mockReturnValue({
      scenePresetId: null,
      attractorMotion: 'noise',
      fieldMode: 'points',
      flowFieldPreset: 'curlNoise',
      boidMix: { default: 1 },
      flowWeight: 0,
      pointAttractorWeight: 1,
      attractorStrength: 0.5,
      attractorSpeed: 0.12,
    }),
    getObstaclesEnabled: jest.fn().mockReturnValue(false),
    getObstaclePreset: jest.fn().mockReturnValue('none'),
    getAttractorsVisible: jest.fn().mockReturnValue(false),
    setAttractorsVisible: jest.fn(),
    presetController: {},
  })),
}));

const MockedBoidsApp = BoidsApp as jest.MockedClass<typeof BoidsApp>;

describe('BoidsSimulation', () => {
  beforeEach(() => {
    MockedBoidsApp.mockClear();
    global.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      disconnect: jest.fn(),
      unobserve: jest.fn(),
    }));
  });

  it('renders a simulation container', () => {
    render(<BoidsSimulation />);
    expect(screen.getByTestId('boids-simulation')).toBeTruthy();
  });

  it('calls destroy on unmount', () => {
    const destroy = jest.fn();
    MockedBoidsApp.mockImplementation(
      () =>
        ({
          init: jest.fn().mockResolvedValue(undefined),
          destroy,
          setGridColors: jest.fn(),
          setObstaclesEnabled: jest.fn(),
          getPresetState: jest.fn(),
          getObstaclesEnabled: jest.fn(),
          getObstaclePreset: jest.fn(),
          presetController: {},
        }) as unknown as BoidsApp
    );

    const { unmount } = render(<BoidsSimulation boidCount={10} attractorCount={2} />);
    unmount();

    expect(MockedBoidsApp).toHaveBeenCalledTimes(1);
    expect(destroy).toHaveBeenCalledTimes(1);
  });

  it('calls onAppReady after init', async () => {
    const onAppReady = jest.fn();
    render(<BoidsSimulation onAppReady={onAppReady} />);
    await Promise.resolve();
    expect(onAppReady).toHaveBeenCalled();
  });
});
