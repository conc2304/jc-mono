# LED Controller Persistence Features Guide

This guide explains the new persistence features added to the LED Controller dashboard.

## Overview

Three main persistence features have been added:
1. **Saved Colors** - Persist custom color swatches between sessions
2. **Saved Gradients** - Persist custom gradients between sessions
3. **Scene Bank** - Save and replay complete lighting configurations (colors or gradient patterns)

## Architecture

### Storage Layer

**Files:**
- [`types/storage.ts`](libs/features/led-controller/src/lib/types/storage.ts) - TypeScript types for stored data
- [`hooks/useLocalStorage.ts`](libs/features/led-controller/src/lib/hooks/useLocalStorage.ts) - Generic localStorage hook
- [`hooks/usePersistentStorage.ts`](libs/features/led-controller/src/lib/hooks/usePersistentStorage.ts) - Domain-specific hooks

**Storage Keys:**
```typescript
{
  SAVED_COLORS: 'led-controller:saved-colors',
  SAVED_GRADIENTS: 'led-controller:saved-gradients',
  SCENES: 'led-controller:scenes',
}
```

### Data Structures

**Scene Object:**
```typescript
interface Scene {
  id: string;
  name: string;
  description?: string;
  type: 'solid-color' | 'gradient-pattern';
  createdAt: number;
  updatedAt: number;
  // For solid color scenes
  color?: string;
  // For gradient pattern scenes
  gradient?: Gradient;
  patternConfig?: GradientPatternConfig;
}
```

## Components

### SceneBank Component
[`components/organisms/scene-bank/SceneBank.tsx`](libs/features/led-controller/src/lib/components/organisms/scene-bank/SceneBank.tsx)

Displays a grid of saved scenes with:
- Visual preview of the color/gradient pattern
- Scene metadata (name, description, type, creation date)
- Action buttons (Play, Edit, Delete)

**Props:**
```typescript
interface SceneBankProps {
  scenes: Scene[];
  onPlayScene: (scene: Scene) => void;
  onDeleteScene: (sceneId: string) => void;
  onUpdateScene?: (sceneId: string, updates: Partial<Scene>) => void;
}
```

### SaveSceneDialog Component
[`components/organisms/save-scene-dialog/SaveSceneDialog.tsx`](libs/features/led-controller/src/lib/components/organisms/save-scene-dialog/SaveSceneDialog.tsx)

Modal dialog for saving the current LED state as a scene:
- Shows a preview of what will be saved
- Allows entering name and description
- Validates required fields

## Usage

### In LedControllerDashboard

The dashboard now uses three custom hooks:

```typescript
// Persistent storage hooks
const { savedColors, setSavedColors } = usePersistentColors();
const { savedGradients, addGradient, removeGradient } = usePersistentGradients();
const { scenes, addScene, updateScene, removeScene } = usePersistentScenes();
```

### Saving a Scene

1. User selects a color or configures a gradient pattern
2. User clicks "Save as Scene" button
3. Dialog opens showing preview
4. User enters name and optional description
5. Scene is saved to localStorage and appears in Scene Bank

### Playing a Scene

1. User clicks "Play" on a scene card in the Scene Bank
2. The scene's configuration is loaded and applied
3. The LED controller displays the scene's color or pattern

### Managing Scenes

- **Edit**: Click the edit icon to change the name/description
- **Delete**: Click the delete icon to remove a scene
- **Automatic Updates**: Scenes include `updatedAt` timestamp when edited

## Features

### Auto-persistence
- All changes are automatically saved to localStorage
- Data persists across browser sessions and page refreshes
- Cross-tab synchronization (changes in one tab appear in others)

### Saved Colors
The existing `ColorSwatchPicker` component already supports saving colors. These are now persisted using the `usePersistentColors` hook.

### Saved Gradients
Custom gradients created in the gradient editor are merged with default gradients:
```typescript
<GradientPatternSelector
  gradients={[...defaultGradients, ...savedGradients]}
  onPatternConfigChange={handlePatternConfigChange}
  activeGradient={patternGradient}
  activePatternConfig={patternConfig}
/>
```

### Scene Bank
- Displays all saved scenes in a responsive grid
- Shows visual preview using `GradientPatternVisualizer` for patterns
- Displays solid color preview for color scenes
- Supports editing scene metadata without changing the actual color/pattern
- One-click playback of any saved scene

## Error Handling

The localStorage hooks include error handling for:
- JSON parsing errors
- localStorage quota exceeded
- Invalid data formats

All errors are logged to console and fallback to initial values.

## Testing Locally

To test the persistence features:

1. Select a color and click "Save as Scene"
2. Configure a gradient pattern and save it
3. Refresh the page - all scenes should still be there
4. Open the app in a new tab - scenes should sync
5. Clear localStorage to reset: `localStorage.clear()`

## Future Enhancements

Potential improvements:
- Export/import scenes as JSON
- Share scenes via URL
- Scene categories/tags
- Scene preview animations
- Duplicate scene functionality
- Batch operations (delete multiple scenes)
- Scene history/versioning
