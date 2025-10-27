import { useState } from 'react';

import { GradientShader } from './gradient-shader';

// Example usage component
export const GradientShaderDemo: React.FC = () => {
  const [colors, setColors] = useState(['#ff0000', '#00ff00', '#0000ff']);
  const [angle, setAngle] = useState(0);
  const [scrollSpeed, setScrollSpeed] = useState(1.0);
  const [scale, setScale] = useState(1.0);
  const [mouseInteraction, setMouseInteraction] = useState(true);
  const [resolution, setResolution] = useState(1.0);
  const [isBackground, setIsBackground] = useState(false);
  const [autoResize, setAutoResize] = useState(false);

  const addColor = () => {
    const randomColor =
      '#' +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, '0');
    setColors([...colors, randomColor]);
  };

  const removeColor = (index: number) => {
    if (colors.length > 1) {
      setColors(colors.filter((_, i) => i !== index));
    }
  };

  const updateColor = (index: number, newColor: string) => {
    const newColors = [...colors];
    newColors[index] = newColor;
    setColors(newColors);
  };

  const getResolutionLabel = (res: number): string => {
    if (res >= 1) return 'Full';
    if (res >= 0.75) return 'High';
    if (res >= 0.5) return 'Medium';
    if (res >= 0.25) return 'Low';
    return 'Lowest';
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        WebGL Interactive Scrolling Gradient Shader
      </h2>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">Colors</h3>
          <div className="space-y-2">
            {colors.map((color, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => updateColor(index, e.target.value)}
                  className="w-10 h-6 rounded border"
                />
                <span className="text-xs font-mono">{color}</span>
                <button
                  onClick={() => removeColor(index)}
                  disabled={colors.length <= 1}
                  className="ml-auto px-1 py-0.5 text-xs bg-red-500 text-white rounded disabled:opacity-50"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              onClick={addColor}
              disabled={colors.length >= 16}
              className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              Add Color
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Angle</h3>
          <div className="space-y-2">
            <label className="block text-sm font-medium">{angle}°</label>
            <input
              type="range"
              min="0"
              max="360"
              value={angle}
              onChange={(e) => setAngle(Number(e.target.value))}
              className="w-full"
            />
            <div className="grid grid-cols-2 gap-1">
              <button
                onClick={() => setAngle(0)}
                className="px-1 py-0.5 text-xs bg-gray-500 text-white rounded"
              >
                0°
              </button>
              <button
                onClick={() => setAngle(90)}
                className="px-1 py-0.5 text-xs bg-gray-500 text-white rounded"
              >
                90°
              </button>
              <button
                onClick={() => setAngle(180)}
                className="px-1 py-0.5 text-xs bg-gray-500 text-white rounded"
              >
                180°
              </button>
              <button
                onClick={() => setAngle(270)}
                className="px-1 py-0.5 text-xs bg-gray-500 text-white rounded"
              >
                270°
              </button>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Speed</h3>
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              {scrollSpeed.toFixed(1)}x
            </label>
            <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={scrollSpeed}
              onChange={(e) => setScrollSpeed(Number(e.target.value))}
              className="w-full"
            />
            <div className="grid grid-cols-3 gap-1">
              <button
                onClick={() => setScrollSpeed(0)}
                className="px-1 py-0.5 text-xs bg-gray-500 text-white rounded"
              >
                Stop
              </button>
              <button
                onClick={() => setScrollSpeed(1)}
                className="px-1 py-0.5 text-xs bg-gray-500 text-white rounded"
              >
                1x
              </button>
              <button
                onClick={() => setScrollSpeed(3)}
                className="px-1 py-0.5 text-xs bg-gray-500 text-white rounded"
              >
                3x
              </button>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Scale</h3>
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              {scale.toFixed(1)}x
            </label>
            <input
              type="range"
              min="0.1"
              max="10"
              step="0.1"
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
              className="w-full"
            />
            <div className="grid grid-cols-3 gap-1">
              <button
                onClick={() => setScale(0.5)}
                className="px-1 py-0.5 text-xs bg-gray-500 text-white rounded"
              >
                0.5x
              </button>
              <button
                onClick={() => setScale(1)}
                className="px-1 py-0.5 text-xs bg-gray-500 text-white rounded"
              >
                1x
              </button>
              <button
                onClick={() => setScale(5)}
                className="px-1 py-0.5 text-xs bg-gray-500 text-white rounded"
              >
                5x
              </button>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Mouse FX</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={mouseInteraction}
                onChange={(e) => setMouseInteraction(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Enable</span>
            </label>
            <p className="text-xs text-gray-600">
              {mouseInteraction
                ? 'Move mouse over canvas to displace colors'
                : 'Mouse interaction disabled'}
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Resolution</h3>
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              {getResolutionLabel(resolution)} ({(resolution * 100).toFixed(0)}
              %)
            </label>
            <input
              type="range"
              min="0.25"
              max="1"
              step="0.25"
              value={resolution}
              onChange={(e) => setResolution(Number(e.target.value))}
              className="w-full"
            />
            <div className="grid grid-cols-2 gap-1">
              <button
                onClick={() => setResolution(0.5)}
                className="px-1 py-0.5 text-xs bg-gray-500 text-white rounded"
              >
                50%
              </button>
              <button
                onClick={() => setResolution(1)}
                className="px-1 py-0.5 text-xs bg-gray-500 text-white rounded"
              >
                100%
              </button>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-3">Background Mode</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isBackground}
                onChange={(e) => setIsBackground(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Background Mode</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={autoResize}
                onChange={(e) => setAutoResize(e.target.checked)}
                disabled={!isBackground}
                className="rounded disabled:opacity-50"
              />
              <span className="text-sm">Auto Resize</span>
            </label>
            <p className="text-xs text-gray-600">
              {isBackground
                ? autoResize
                  ? 'Uses document events + auto-resizes to window size'
                  : 'Uses document events, fixed size'
                : 'Uses canvas mouse events (normal mode)'}
            </p>
          </div>
        </div>
      </div>

      {isBackground && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800">
            <strong>Background Mode Demo:</strong> The canvas below has
            pointer-events: none and uses document-level mouse tracking. Mouse
            over this entire area to see the effect work even though the canvas
            can't receive direct mouse events.
          </p>
        </div>
      )}

      <div className="mb-4 relative">
        <GradientShader
          colors={colors}
          angle={angle}
          scrollSpeed={scrollSpeed}
          scale={scale}
          mouseInteraction={mouseInteraction}
          resolution={resolution}
          isBackground={isBackground}
          autoResize={autoResize}
          width={800}
          height={400}
          style={
            isBackground
              ? {
                  position: 'absolute',
                  zIndex: -1,
                }
              : {}
          }
        />
        {isBackground && (
          <div className="relative z-10 p-4 bg-white/80 backdrop-blur-sm rounded border-2 border-dashed border-gray-300">
            <h3 className="text-lg font-semibold mb-2">
              Content Over Background
            </h3>
            <p className="text-sm text-gray-700">
              This content is positioned over the background shader. Move your
              mouse around this area and you'll see the shader responding even
              though it's behind this content with z-index: -1 and
              pointer-events: none.
            </p>
            <button className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
              Clickable Button
            </button>
          </div>
        )}
      </div>

      <div className="text-sm text-gray-600 space-y-1">
        <p>
          <strong>Performance Features:</strong>
        </p>
        <p>
          • <strong>Resolution Control:</strong> Lower resolution values (e.g.,
          0.5) render at half the pixel density but maintain full visual size
        </p>
        <p>
          • <strong>Auto Resize:</strong> When enabled with background mode,
          automatically resizes to match window dimensions
        </p>
        <p>
          • <strong>Perfect for Websites:</strong> Use autoResize + background
          mode for full-screen responsive backgrounds
        </p>
        <p>
          • <strong>Interactive Features:</strong> All previous features remain:
          mouse effects, animated scrolling, scalable bands
        </p>
        <p>
          • <strong>Tip:</strong> For website backgrounds, try 25-50% resolution
          for optimal performance
        </p>
      </div>
    </div>
  );
};
