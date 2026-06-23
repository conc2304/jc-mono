import { render, screen, fireEvent } from '@testing-library/react';

import type { BoidsApp } from '../core/boids-app';
import { BoidsSettingsPanel } from './boids-settings-panel';

const mockApp = {
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
    boidSpeedMultiplier: 1,
  }),
  getObstaclesEnabled: jest.fn().mockReturnValue(false),
  getAttractorsVisible: jest.fn().mockReturnValue(false),
  setAttractorsVisible: jest.fn(),
} as unknown as BoidsApp;

describe('BoidsSettingsPanel', () => {
  it('renders panel title and footer label', () => {
    render(<BoidsSettingsPanel app={null} />);
    expect(screen.getByRole('heading', { name: 'Boids' })).toBeTruthy();
    expect(screen.getAllByText('Boids')).toHaveLength(2);
  });

  it('toggles aria-expanded on collapse', () => {
    render(<BoidsSettingsPanel app={null} />);
    const button = screen.getByRole('button', { name: 'Collapse settings' });
    expect(button.getAttribute('aria-expanded')).toBe('true');
    fireEvent.click(button);
    expect(screen.getByRole('button', { name: 'Expand settings' }).getAttribute('aria-expanded')).toBe('false');
  });

  it('toggles attractor visibility via app API', () => {
    render(<BoidsSettingsPanel app={mockApp} />);
    fireEvent.click(screen.getByRole('checkbox', { name: 'Show attractors' }));
    expect(mockApp.setAttractorsVisible).toHaveBeenCalledWith(true);
  });

  it('opens help on info click and closes on click away', () => {
    render(<BoidsSettingsPanel app={null} />);
    const helpButton = screen.getByRole('button', { name: 'Settings help' });
    fireEvent.click(helpButton);
    expect(screen.getByText('Controls')).toBeTruthy();
    expect(helpButton.getAttribute('aria-expanded')).toBe('true');

    fireEvent.click(document.body.querySelector('.MuiBackdrop-root')!);
    expect(helpButton.getAttribute('aria-expanded')).toBe('false');
  });
});
