import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { hexToRgb, remapNumber } from '@jc/utils';
import { ledApiService, SetGradientPatternRequest } from '../data-fetching';

// Query keys
export const ledQueryKeys = {
  all: ['led'] as const,
  status: () => [...ledQueryKeys.all, 'status'] as const,
};

/**
 * Hook to fetch LED controller status
 */
export function useLedStatus() {
  return useQuery({
    queryKey: ledQueryKeys.status(),
    queryFn: () => ledApiService.getStatus(),
    refetchOnWindowFocus: true,
    retry: false,
    refetchInterval: 5000, // Poll every 5 seconds
    staleTime: 3000, // Consider data fresh for 3 seconds
  });
}

/**
 * Hook to update solid color with optimistic updates
 */
export function useSetSolidColor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (color: string) => {
      const { r, g, b } = hexToRgb(color);
      return ledApiService.setColor({ r, g, b });
    },
    onMutate: async (color: string) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ledQueryKeys.status() });

      // Snapshot the previous value
      const previous = queryClient.getQueryData(ledQueryKeys.status());

      // Optimistically update to the new value
      const { r, g, b } = hexToRgb(color);
      queryClient.setQueryData(ledQueryKeys.status(), (old: any) => ({
        ...old,
        'led-state': {
          ...old?.['led-state'],
          current_solid_color: { r, g, b },
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
              current_solid_color: color,
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
 */
export function useSetGradientPattern() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SetGradientPatternRequest) => {
      return ledApiService.setGradientPattern(data);
    },
    onMutate: async (data: SetGradientPatternRequest) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ledQueryKeys.status() });

      // Snapshot the previous value
      const previous = queryClient.getQueryData(ledQueryKeys.status());

      // Optimistically update to the new value
      queryClient.setQueryData(ledQueryKeys.status(), (old: any) => ({
        ...old,
        'led-state': {
          ...old?.['led-state'],
          current_gradient_pattern: {
            type: data.type,
            colorStops: data.colorStops,
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
          queryClient.setQueryData(ledQueryKeys.status(), (old: any) => ({
            ...old,
            'led-state': {
              ...old?.['led-state'],
              current_gradient_pattern: gradient,
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
