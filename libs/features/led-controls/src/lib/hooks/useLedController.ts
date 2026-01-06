import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  hexToRgb,
  remapNumber,
  rgbObjectToHex,
  transformColorStopToBackend,
} from '@jc/utils';
import {
  ledApiService,
  SetGradientPatternRequest,
  LedStatusResponse,
} from '../data-fetching';

// Frontend gradient request with hex colors
export interface FrontendGradientRequest {
  colorStops: Array<{ position: number; color: string }>; // hex format
  type: string;
  speed: number;
  interpolation: string;
  period?: number;
  direction?: string;
  wave?: {
    type: string | null;
    period: number;
    amplitude: number;
  };
}

// Query keys
export const ledQueryKeys = {
  all: ['led'] as const,
  status: () => [...ledQueryKeys.all, 'status'] as const,
};

/**
 * Hook to fetch LED controller status with color transformations
 * Transforms backend RGB (0-1) to frontend hex colors
 */
export function useLedStatus() {
  return useQuery({
    queryKey: ledQueryKeys.status(),
    queryFn: () => ledApiService.getStatus(),
    select: (data: LedStatusResponse) => {
      // Transform backend response to include hex colors
      const ledState = data['led-state'];

      return {
        ...data,
        'led-state': {
          ...ledState,
          // Add hex property to current_solid_color
          current_solid_color: ledState.current_solid_color
            ? {
                ...ledState.current_solid_color,
                hex: rgbObjectToHex(ledState.current_solid_color),
              }
            : ledState.current_solid_color,
          // Transform gradient pattern color stops to include hex
          current_gradient_pattern: ledState.current_gradient_pattern
            ? {
                ...ledState.current_gradient_pattern,
                colorStops: ledState.current_gradient_pattern.colorStops.map(
                  (stop) => ({
                    ...stop,
                    hex: rgbObjectToHex(stop),
                  })
                ),
              }
            : ledState.current_gradient_pattern,
        },
      };
    },
    refetchOnWindowFocus: true,
    retry: false,
    refetchInterval: 60000, // Poll every 60 seconds
    staleTime: 15000, // Consider data fresh for 15 seconds
  });
}

/**
 * Hook to update solid color with optimistic updates
 * Accepts hex color string, converts to backend RGB format
 */
export function useSetSolidColor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (color: string) => {
      // Convert hex to RGB (0-1 range) for backend
      const rgb = hexToRgb(color, true, 3); // normalize to 0-1, round to 3 decimals
      return ledApiService.setColor(rgb);
    },
    onMutate: async (color: string) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ledQueryKeys.status() });

      // Snapshot the previous value
      const previous = queryClient.getQueryData(ledQueryKeys.status());

      // Optimistically update to the new value
      const rgb = hexToRgb(color, true, 3);
      queryClient.setQueryData(ledQueryKeys.status(), (old: any) => ({
        ...old,
        'led-state': {
          ...old?.['led-state'],
          current_solid_color: {
            ...rgb,
            hex: color, // Store both RGB and hex
          },
          current_content_name: 'solid-color',
        },
      }));

      return { previous };
    },
    onSuccess: (response) => {
      // Update with actual server response
      if (response.success && response.data) {
        const { color, active_state } = response.data;
        if (color && active_state) {
          queryClient.setQueryData(ledQueryKeys.status(), (old: any) => ({
            ...old,
            'led-state': {
              ...old?.['led-state'],
              current_solid_color: {
                ...color,
                hex: rgbObjectToHex(color), // Add hex property
              },
              current_content_name: active_state,
            },
          }));
        }
      }
    },
    onError: (_err, _variables, context) => {
      // Roll back to previous state on error
      if (context?.previous) {
        queryClient.setQueryData(ledQueryKeys.status(), context.previous);
      }
    },
  });
}

/**
 * Hook to update gradient pattern with optimistic updates
 * Accepts frontend format with hex colors, converts to backend RGB format
 */
export function useSetGradientPattern() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FrontendGradientRequest) => {
      // Transform frontend hex colors to backend RGB format (0-1 range)
      const backendColorStops = data.colorStops.map(
        transformColorStopToBackend
      );

      const backendRequest: SetGradientPatternRequest = {
        ...data,
        colorStops: backendColorStops,
      };

      return ledApiService.setGradientPattern(backendRequest);
    },
    onMutate: async (data: FrontendGradientRequest) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ledQueryKeys.status() });

      // Snapshot the previous value
      const previous = queryClient.getQueryData(ledQueryKeys.status());

      // Transform frontend format to backend format for optimistic update
      const backendColorStops = data.colorStops.map(
        transformColorStopToBackend
      );

      // Optimistically update to the new value (with both RGB and hex)
      queryClient.setQueryData(ledQueryKeys.status(), (old: any) => ({
        ...old,
        'led-state': {
          ...old?.['led-state'],
          current_gradient_pattern: {
            type: data.type,
            colorStops: backendColorStops.map((stop, idx) => ({
              ...stop,
              hex: data.colorStops[idx].color, // Add hex property
            })),
            speed: data.speed,
            period: data.period || 1,
            interpolation: data.interpolation,
            wave: data.wave,
          },
          current_content_name: 'gradient',
        },
      }));

      return { previous };
    },
    onSuccess: (response) => {
      // Update with actual server response
      if (response.success && response.data) {
        const { gradient, active_state } = response.data;
        if (gradient && active_state) {
          // Transform backend RGB to include hex colors
          const gradientWithHex = {
            ...gradient,
            colorStops: gradient.colorStops.map((stop) => ({
              ...stop,
              hex: rgbObjectToHex(stop),
            })),
          };

          queryClient.setQueryData(ledQueryKeys.status(), (old: any) => ({
            ...old,
            'led-state': {
              ...old?.['led-state'],
              current_gradient_pattern: gradientWithHex,
              current_content_name: active_state,
            },
          }));
        }
      }
    },
    onError: (_err, _variables, context) => {
      // Roll back to previous state on error
      if (context?.previous) {
        queryClient.setQueryData(ledQueryKeys.status(), context.previous);
      }
    },
  });
}

/**
 * Hook to update brightness with optimistic updates
 */
export function useSetBrightness() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (brightness: number) => {
      const tdValue = remapNumber(brightness, 0, 100, 0, 1);
      return ledApiService.setBrightness({ brightness: tdValue });
    },
    onMutate: async (brightness: number) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ledQueryKeys.status() });

      // Snapshot the previous value
      const previous = queryClient.getQueryData(ledQueryKeys.status());

      // Optimistically update to the new value
      const tdValue = remapNumber(brightness, 0, 100, 0, 1);
      queryClient.setQueryData(ledQueryKeys.status(), (old: any) => ({
        ...old,
        'led-state': {
          ...old?.['led-state'],
          brightness: tdValue,
        },
      }));

      return { previous };
    },
    onSuccess: (response) => {
      // Update with actual server response
      if (response.success && response.data) {
        const brightnessValue = response.data.brightness;
        if (brightnessValue !== undefined) {
          queryClient.setQueryData(ledQueryKeys.status(), (old: any) => ({
            ...old,
            'led-state': {
              ...old?.['led-state'],
              brightness: brightnessValue,
            },
          }));
        }
      }
    },
    onError: (_err, _variables, context) => {
      // Roll back to previous state on error
      if (context?.previous) {
        queryClient.setQueryData(ledQueryKeys.status(), context.previous);
      }
    },
  });
}

/**
 * Hook to update invert with optimistic updates
 * Note: The invert endpoint doesn't return data, so we only update on polling
 */
export function useSetInvert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invert: number) => {
      const tdValue = remapNumber(invert, 0, 100, 0, 1);
      return ledApiService.setInvert({ invert: tdValue });
    },
    onMutate: async () => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ledQueryKeys.status() });

      // Snapshot the previous value
      const previous = queryClient.getQueryData(ledQueryKeys.status());

      // Note: Invert is not part of the status response, so we can't optimistically update it
      // The polling will handle syncing this value

      return { previous };
    },
    onError: (_err, _variables, context) => {
      // Roll back to previous state on error
      if (context?.previous) {
        queryClient.setQueryData(ledQueryKeys.status(), context.previous);
      }
    },
  });
}

/**
 * Hook to update hue rotation speed with optimistic updates
 */
export function useSetHueRotationSpeed() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (rotationSpeed: number) => {
      const tdValue = remapNumber(rotationSpeed, 0, 100, 0, 1);
      return ledApiService.setHueRotationSpeed({ speed: tdValue });
    },
    onMutate: async (rotationSpeed: number) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ledQueryKeys.status() });

      // Snapshot the previous value
      const previous = queryClient.getQueryData(ledQueryKeys.status());

      // Optimistically update to the new value
      const tdValue = remapNumber(rotationSpeed, 0, 100, 0, 1);
      queryClient.setQueryData(ledQueryKeys.status(), (old: any) => ({
        ...old,
        'led-state': {
          ...old?.['led-state'],
          hue_rotation_speed: tdValue,
        },
      }));

      return { previous };
    },
    onSuccess: (response) => {
      // Update with actual server response
      if (response.success && response.data) {
        const speedValue = response.data.speed;
        if (speedValue !== undefined) {
          queryClient.setQueryData(ledQueryKeys.status(), (old: any) => ({
            ...old,
            'led-state': {
              ...old?.['led-state'],
              hue_rotation_speed: speedValue,
            },
          }));
        }
      }
    },
    onError: (_err, _variables, context) => {
      // Roll back to previous state on error
      if (context?.previous) {
        queryClient.setQueryData(ledQueryKeys.status(), context.previous);
      }
    },
  });
}

/**
 * Hook to update power state with optimistic updates
 */
export function useSetPower() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (power: boolean) => {
      const powerToInt = Number(power);
      return ledApiService.setPower({ power: powerToInt });
    },
    onMutate: async (power: boolean) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ledQueryKeys.status() });

      // Snapshot the previous value
      const previous = queryClient.getQueryData(ledQueryKeys.status());

      // Optimistically update to the new value
      queryClient.setQueryData(ledQueryKeys.status(), (old: any) => ({
        ...old,
        'led-state': {
          ...old?.['led-state'],
          power_on: power,
        },
      }));

      return { previous };
    },
    onSuccess: (response) => {
      // Update with actual server response
      if (response.success && response.data) {
        const powerValue = response.data.power;
        if (powerValue !== undefined) {
          queryClient.setQueryData(ledQueryKeys.status(), (old: any) => ({
            ...old,
            'led-state': {
              ...old?.['led-state'],
              power_on: Boolean(powerValue),
            },
          }));
        }
      }
    },
    onError: (_err, _variables, context) => {
      // Roll back to previous state on error
      if (context?.previous) {
        queryClient.setQueryData(ledQueryKeys.status(), context.previous);
      }
    },
  });
}
