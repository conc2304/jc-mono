import { render, screen } from '@testing-library/react';

import { BoidsSimulation } from './components/boids-simulation';
import { BoidsApp } from './core/boids-app';

jest.mock('./core/boids-app', () => ({
  BoidsApp: jest.fn().mockImplementation(() => ({
    init: jest.fn().mockResolvedValue(undefined),
    destroy: jest.fn(),
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
        }) as unknown as BoidsApp
    );

    const { unmount } = render(<BoidsSimulation boidCount={10} attractorCount={2} />);
    unmount();

    expect(MockedBoidsApp).toHaveBeenCalledTimes(1);
    expect(destroy).toHaveBeenCalledTimes(1);
  });
});
