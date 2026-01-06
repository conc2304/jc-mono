import type {
  LedStatusResponse,
  SetBrightnessRequest,
  SetColorRequest,
  SetGradientPatternRequest,
  SetHueRotationSpeedRequest,
  SetInvertRequest,
  SetPowerRequest,
} from '../types/led-api.types';

const TD_SERVER_API = 'https://192.168.4.44:9980';
const API_PATH = '/api/v1';

class LedApiService {
  private baseUrl = `${TD_SERVER_API}${API_PATH}`;

  async getStatus(): Promise<LedStatusResponse> {
    const response = await fetch(`${this.baseUrl}/status`);
    if (!response.ok) {
      throw new Error('Failed to fetch LED status');
    }
    return response.json();
  }

  async setColor(data: SetColorRequest): Promise<void> {
    const response = await fetch(`${this.baseUrl}/color`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to set color');
    }
  }

  async setGradientPattern(data: SetGradientPatternRequest): Promise<void> {
    const response = await fetch(`${this.baseUrl}/gradient-pattern`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        period: data.period || 1,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to set gradient pattern');
    }
  }

  async setBrightness(data: SetBrightnessRequest): Promise<void> {
    const response = await fetch(`${this.baseUrl}/brightness`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to set brightness');
    }
  }

  async setInvert(data: SetInvertRequest): Promise<void> {
    const response = await fetch(`${this.baseUrl}/invert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to set invert');
    }
  }

  async setHueRotationSpeed(data: SetHueRotationSpeedRequest): Promise<void> {
    const response = await fetch(`${this.baseUrl}/hue-rotation-speed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to set hue rotation speed');
    }
  }

  async setPower(data: SetPowerRequest): Promise<void> {
    const response = await fetch(`${this.baseUrl}/power`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to set power');
    }
  }
}

export const ledApiService = new LedApiService();
