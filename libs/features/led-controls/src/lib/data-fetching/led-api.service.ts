import type {
  BrightnessPostResponse,
  ColorPostResponse,
  GradientPostResponse,
  HueRotationPostResponse,
  LedStatusResponse,
  PowerSetResponse,
  SetBrightnessRequest,
  SetColorRequest,
  SetGradientPatternRequest,
  SetHueRotationSpeedRequest,
  SetInvertRequest,
  SetPowerRequest,
} from './types';

const TD_SERVER_API = 'https://192.168.4.44:9980';
const API_PATH = '/api/v1';

class LedApiService {
  private baseUrl = `${TD_SERVER_API}${API_PATH}`;

  async getStatus(): Promise<LedStatusResponse> {
    const response = await fetch(`${this.baseUrl}/status`);
    if (!response.ok) {
      throw new Error('Failed to fetch LED status');
    }
    return response.json() as Promise<LedStatusResponse>;
  }

  async setColor(data: SetColorRequest): Promise<ColorPostResponse> {
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
    return response.json() as Promise<ColorPostResponse>;
  }

  async setGradientPattern(
    data: SetGradientPatternRequest
  ): Promise<GradientPostResponse> {
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
    return response.json() as Promise<GradientPostResponse>;
  }

  async setBrightness(
    data: SetBrightnessRequest
  ): Promise<BrightnessPostResponse> {
    const response = await fetch(`${this.baseUrl}/brightness`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to set brightness');
    }
    return response.json() as Promise<BrightnessPostResponse>;
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

  async setHueRotationSpeed(
    data: SetHueRotationSpeedRequest
  ): Promise<HueRotationPostResponse> {
    const response = await fetch(`${this.baseUrl}/hue-rotation-speed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to set hue rotation speed');
    }
    return response.json() as Promise<HueRotationPostResponse>;
  }

  async setPower(data: SetPowerRequest): Promise<PowerSetResponse> {
    const response = await fetch(`${this.baseUrl}/power`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to set power');
    }
    return response.json() as Promise<PowerSetResponse>;
  }
}

export const ledApiService = new LedApiService();
