import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { hexToRgb, remapNumber } from '@jc/utils';
import { ledApiService } from '../services/led-api.service';
import type {
  SetGradientPatternRequest,
} from '../types/led-api.types';

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
  });
}

/**
 * Hook to update solid color
 */
export function useSetSolidColor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (color: string) => {
      const { r, g, b } = hexToRgb(color);
      return ledApiService.setColor({ r, g, b });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ledQueryKeys.status() });
    },
  });
}

/**
 * Hook to update gradient pattern
 */
export function useSetGradientPattern() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SetGradientPatternRequest) => {
      return ledApiService.setGradientPattern(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ledQueryKeys.status() });
    },
  });
}

/**
 * Hook to update brightness
 */
export function useSetBrightness() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (brightness: number) => {
      const tdValue = remapNumber(brightness, 0, 100, 0, 2);
      return ledApiService.setBrightness({ brightness: tdValue });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ledQueryKeys.status() });
    },
  });
}

/**
 * Hook to update invert
 */
export function useSetInvert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invert: number) => {
      const tdValue = remapNumber(invert, 0, 100, 0, 1);
      return ledApiService.setInvert({ invert: tdValue });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ledQueryKeys.status() });
    },
  });
}

/**
 * Hook to update hue rotation speed
 */
export function useSetHueRotationSpeed() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (rotationSpeed: number) => {
      const tdValue = remapNumber(rotationSpeed, 0, 100, 0, 1);
      return ledApiService.setHueRotationSpeed({ speed: tdValue });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ledQueryKeys.status() });
    },
  });
}

/**
 * Hook to update power state
 */
export function useSetPower() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (power: boolean) => {
      const powerToInt = Number(power);
      return ledApiService.setPower({ power: powerToInt });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ledQueryKeys.status() });
    },
  });
}
