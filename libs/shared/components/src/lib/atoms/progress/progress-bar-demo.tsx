import { useEffect, useState } from 'react';

// Demo component showing different configurations
export const ProgressBarDemo = () => {
  const [progress1, setProgress1] = useState(0);
  const [progress2, setProgress2] = useState(75);
  const [progress3, setProgress3] = useState(45);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress1((prev) => (prev >= 100 ? 0 : prev + 0.5));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12 text-cyan-400 font-mono">
          Flat Sci-Fi Progress Containers
        </h1>

        <div className="space-y-8">
          {/* Auto-incrementing progress */}
          <div className="text-center">
            <h3 className="text-xl mb-4 text-green-400 font-mono">
              Auto Progress - Default Style
            </h3>
            <FlatSciFiProgress progress={progress1} label="DOWNLOADING" />
          </div>

          {/* Static progress with custom colors */}
          <div className="text-center">
            <h3 className="text-xl mb-4 text-green-400 font-mono">
              Static Progress - Custom Colors
            </h3>
            <FlatSciFiProgress
              progress={progress2}
              width={400}
              height={100}
              color="#ff6b6b"
              glowColor="#ff9999"
              borderColor="#ff6b6b"
              label="UPLOADING"
              pulseEffect={false}
            />
            <div className="mt-4 flex justify-center">
              <input
                type="range"
                min="0"
                max="100"
                value={progress2}
                onChange={(e) => setProgress2(parseInt(e.target.value))}
                className="w-96"
              />
            </div>
          </div>

          {/* Indeterminate loading */}
          <div className="text-center">
            <h3 className="text-xl mb-4 text-green-400 font-mono">
              Indeterminate Loading - Purple Theme
            </h3>
            <FlatSciFiProgress
              indeterminate={true}
              width={350}
              height={80}
              color="#9d4edd"
              glowColor="#c77dff"
              borderColor="#9d4edd"
              label="PROCESSING"
            />
          </div>

          {/* Minimal design */}
          <div className="text-center">
            <h3 className="text-xl mb-4 text-green-400 font-mono">
              Minimal - No Decorations
            </h3>
            <FlatSciFiProgress
              progress={progress3}
              width={500}
              height={60}
              color="#00d4aa"
              glowColor="#00ffc8"
              borderColor="#00d4aa"
              label="SCANNING"
              energyLines={false}
              gridPattern={false}
              pulseEffect={false}
            />
            <div className="mt-4 flex justify-center">
              <input
                type="range"
                min="0"
                max="100"
                value={progress3}
                onChange={(e) => setProgress3(parseInt(e.target.value))}
                className="w-96"
              />
            </div>
          </div>

          {/* Large with all effects */}
          <div className="text-center">
            <h3 className="text-xl mb-4 text-green-400 font-mono">
              Large - All Effects Enabled
            </h3>
            <FlatSciFiProgress
              progress={85}
              width={600}
              height={140}
              color="#ff8500"
              glowColor="#ffad33"
              borderColor="#ff8500"
              label="NEURAL LINK SYNC"
              backgroundColor="rgba(255, 133, 0, 0.1)"
            />
          </div>

          {/* Small compact */}
          <div className="text-center">
            <h3 className="text-xl mb-4 text-green-400 font-mono">
              Compact Size
            </h3>
            <FlatSciFiProgress
              progress={60}
              width={250}
              height={50}
              color="#00ffff"
              glowColor="#ffffff"
              borderColor="#00ffff"
              label="LOAD"
              showPercentage={false}
            />
          </div>
        </div>

        {/* Usage Examples */}
        <div className="mt-16 bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-cyan-400 font-mono">
            Usage Examples
          </h2>
          <pre className="text-green-400 text-sm font-mono overflow-x-auto">
            {`// Basic usage
<FlatSciFiProgress progress={75} />

// Indeterminate loading
<FlatSciFiProgress indeterminate={true} />

// Custom styling
<FlatSciFiProgress
  progress={50}
  width={400}
  height={100}
  color="#ff6b6b"
  glowColor="#ff9999"
  borderColor="#ff6b6b"
  label="CUSTOM TASK"
  showPercentage={true}
  energyLines={true}
  pulseEffect={true}
  gridPattern={true}
/>

// Minimal design
<FlatSciFiProgress
  progress={75}
  energyLines={false}
  gridPattern={false}
  pulseEffect={false}
/>

// Props:
// progress: number (0-100) - Progress percentage
// indeterminate: boolean - Endless loading animation
// width: number - Container width in pixels (default: 300)
// height: number - Container height in pixels (default: 120)
// color: string - Primary color (default: '#00ff88')
// glowColor: string - Glow effect color (default: '#00ffff')
// backgroundColor: string - Container background (default: 'rgba(0, 0, 0, 0.8)')
// borderColor: string - Border color (default: '#00ff88')
// showPercentage: boolean - Show percentage text (default: true)
// showLabel: boolean - Show label text (default: true)
// label: string - Custom label text (default: 'PROCESSING')
// energyLines: boolean - Show animated energy lines (default: true)
// pulseEffect: boolean - Enable pulse glow effect (default: true)
// gridPattern: boolean - Show grid background pattern (default: true)
// className: string - Additional CSS classes`}
          </pre>
        </div>
      </div>
    </div>
  );
};
