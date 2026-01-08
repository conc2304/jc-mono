import { useState, useCallback } from 'react';
import { hexToRgb, rgbToHex } from '@jc/utils';

export interface ColorStop {
  id: number;
  color: string;
  position: number;
}

export interface GradientData {
  stops: ColorStop[];
  cssGradient: string;
}

export interface UseGradientStopsReturn {
  stops: ColorStop[];
  selectedStop: number | null;
  setSelectedStop: (id: number | null) => void;
  addStop: () => void;
  removeStop: (stopId: number) => void;
  updateStopColor: (stopId: number, color: string) => void;
  updateStopPosition: (stopId: number, position: number) => void;
  navigateToPreviousStop: () => void;
  navigateToNextStop: () => void;
  generateGradient: () => string;
  interpolateColor: (position: number) => string;
  getSortedStops: () => ColorStop[];
}

export const useGradientStops = (
  initialStops?: ColorStop[]
): UseGradientStopsReturn => {
  const [stops, setStops] = useState<ColorStop[]>(
    initialStops || [
      { id: 1, color: '#ff0000', position: 0 },
      { id: 2, color: '#00ff00', position: 50 },
      { id: 3, color: '#0000ff', position: 100 },
    ]
  );
  const [selectedStop, setSelectedStop] = useState<number | null>(null);
  const [nextId, setNextId] = useState<number>(
    initialStops ? Math.max(...initialStops.map((s) => s.id)) + 1 : 4
  );

  const getSortedStops = useCallback((): ColorStop[] => {
    return [...stops].sort((a, b) => a.position - b.position);
  }, [stops]);

  const generateGradient = useCallback((): string => {
    const sortedStops = getSortedStops();
    const gradientString = sortedStops
      .map((stop) => `${stop.color} ${stop.position}%`)
      .join(', ');
    return `linear-gradient(to right, ${gradientString})`;
  }, [getSortedStops]);

  const interpolateColor = useCallback(
    (position: number): string => {
      const sortedStops = getSortedStops();

      let leftStop = sortedStops[0];
      let rightStop = sortedStops[sortedStops.length - 1];

      for (let i = 0; i < sortedStops.length - 1; i++) {
        if (
          sortedStops[i].position <= position &&
          sortedStops[i + 1].position >= position
        ) {
          leftStop = sortedStops[i];
          rightStop = sortedStops[i + 1];
          break;
        }
      }

      const range = rightStop.position - leftStop.position;
      const factor = range === 0 ? 0 : (position - leftStop.position) / range;

      const leftRgb = hexToRgb(leftStop.color);
      const rightRgb = hexToRgb(rightStop.color);

      const r = Math.round(leftRgb.r + (rightRgb.r - leftRgb.r) * factor);
      const g = Math.round(leftRgb.g + (rightRgb.g - leftRgb.g) * factor);
      const b = Math.round(leftRgb.b + (rightRgb.b - leftRgb.b) * factor);

      return rgbToHex(r, g, b);
    },
    [getSortedStops]
  );

  const addStop = useCallback((): void => {
    setStops((prevStops) => {
      const sortedStops = [...prevStops].sort((a, b) => a.position - b.position);
      let maxGap = 0;
      let maxGapPosition = 50;

      for (let i = 0; i < sortedStops.length - 1; i++) {
        const gap = sortedStops[i + 1].position - sortedStops[i].position;
        if (gap > maxGap) {
          maxGap = gap;
          maxGapPosition = sortedStops[i].position + gap / 2;
        }
      }

      const color = interpolateColor(maxGapPosition);

      const newStop: ColorStop = {
        id: nextId,
        color: color,
        position: maxGapPosition,
      };

      setNextId(nextId + 1);
      setSelectedStop(newStop.id);

      return [...prevStops, newStop];
    });
  }, [nextId, interpolateColor]);

  const removeStop = useCallback(
    (stopId: number): void => {
      setStops((prevStops) => {
        if (prevStops.length <= 2) {
          alert('You must have at least 2 color stops');
          return prevStops;
        }
        return prevStops.filter((stop) => stop.id !== stopId);
      });
      if (selectedStop === stopId) {
        setSelectedStop(null);
      }
    },
    [selectedStop]
  );

  const updateStopColor = useCallback(
    (stopId: number, newColor: string): void => {
      setStops((prevStops) =>
        prevStops.map((stop) =>
          stop.id === stopId ? { ...stop, color: newColor } : stop
        )
      );
    },
    []
  );

  const updateStopPosition = useCallback(
    (stopId: number, newPosition: number): void => {
      const clampedPosition = Math.max(0, Math.min(100, newPosition));
      setStops((prevStops) =>
        prevStops.map((stop) =>
          stop.id === stopId ? { ...stop, position: clampedPosition } : stop
        )
      );
    },
    []
  );

  const navigateToPreviousStop = useCallback((): void => {
    if (selectedStop === null) {
      const sortedStops = getSortedStops();
      setSelectedStop(sortedStops[0].id);
      return;
    }

    const sortedStops = getSortedStops();
    const currentIndex = sortedStops.findIndex(
      (stop) => stop.id === selectedStop
    );

    if (currentIndex === -1) return;

    const previousIndex =
      currentIndex === 0 ? sortedStops.length - 1 : currentIndex - 1;
    setSelectedStop(sortedStops[previousIndex].id);
  }, [selectedStop, getSortedStops]);

  const navigateToNextStop = useCallback((): void => {
    if (selectedStop === null) {
      const sortedStops = getSortedStops();
      setSelectedStop(sortedStops[0].id);
      return;
    }

    const sortedStops = getSortedStops();
    const currentIndex = sortedStops.findIndex(
      (stop) => stop.id === selectedStop
    );

    if (currentIndex === -1) return;

    const nextIndex =
      currentIndex === sortedStops.length - 1 ? 0 : currentIndex + 1;
    setSelectedStop(sortedStops[nextIndex].id);
  }, [selectedStop, getSortedStops]);

  return {
    stops,
    selectedStop,
    setSelectedStop,
    addStop,
    removeStop,
    updateStopColor,
    updateStopPosition,
    navigateToPreviousStop,
    navigateToNextStop,
    generateGradient,
    interpolateColor,
    getSortedStops,
  };
};
