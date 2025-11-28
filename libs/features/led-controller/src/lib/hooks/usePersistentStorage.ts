import { useCallback } from 'react';
import type { Gradient } from '@jc/ui-components';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS, type Scene } from '../types/storage';

export function usePersistentColors() {
  const [savedColors, setSavedColors, clearColors] = useLocalStorage<string[]>(
    STORAGE_KEYS.SAVED_COLORS,
    []
  );

  const addColor = useCallback(
    (color: string) => {
      setSavedColors((prev) => {
        if (prev.includes(color)) return prev;
        return [...prev, color];
      });
    },
    [setSavedColors]
  );

  const removeColor = useCallback(
    (color: string) => {
      setSavedColors((prev) => prev.filter((c) => c !== color));
    },
    [setSavedColors]
  );

  return {
    savedColors,
    addColor,
    removeColor,
    setSavedColors,
    clearColors,
  };
}

export function usePersistentGradients() {
  const [savedGradients, setSavedGradients, clearGradients] = useLocalStorage<
    Gradient[]
  >(STORAGE_KEYS.SAVED_GRADIENTS, []);

  const addGradient = useCallback(
    (gradient: Gradient) => {
      setSavedGradients((prev) => {
        // Check if gradient with same ID already exists
        if (prev.some((g) => g.id === gradient.id)) {
          // Update existing gradient
          return prev.map((g) => (g.id === gradient.id ? gradient : g));
        }
        return [...prev, gradient];
      });
    },
    [setSavedGradients]
  );

  const removeGradient = useCallback(
    (gradientId: string) => {
      setSavedGradients((prev) => prev.filter((g) => g.id !== gradientId));
    },
    [setSavedGradients]
  );

  return {
    savedGradients,
    addGradient,
    removeGradient,
    setSavedGradients,
    clearGradients,
  };
}

export function usePersistentScenes() {
  const [scenes, setScenes, clearScenes] = useLocalStorage<Scene[]>(
    STORAGE_KEYS.SCENES,
    []
  );

  const addScene = useCallback(
    (scene: Omit<Scene, 'id' | 'createdAt' | 'updatedAt'>) => {
      const newScene: Scene = {
        ...scene,
        id: `scene-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      setScenes((prev) => [...prev, newScene]);
      return newScene;
    },
    [setScenes]
  );

  const updateScene = useCallback(
    (sceneId: string, updates: Partial<Omit<Scene, 'id' | 'createdAt'>>) => {
      setScenes((prev) =>
        prev.map((scene) =>
          scene.id === sceneId
            ? { ...scene, ...updates, updatedAt: Date.now() }
            : scene
        )
      );
    },
    [setScenes]
  );

  const removeScene = useCallback(
    (sceneId: string) => {
      setScenes((prev) => prev.filter((scene) => scene.id !== sceneId));
    },
    [setScenes]
  );

  const getScene = useCallback(
    (sceneId: string) => {
      return scenes.find((scene) => scene.id === sceneId);
    },
    [scenes]
  );

  return {
    scenes,
    addScene,
    updateScene,
    removeScene,
    getScene,
    clearScenes,
  };
}
