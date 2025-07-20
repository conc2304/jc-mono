import { useEffect, useState } from 'react';
import { TorusFieldProgress } from './torus-field-progress';

// Demo component showing how to use the progress component
const TorusProgressDemo = () => {
  const [progress, setProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          const next = prev + 1;
          if (next >= 100) {
            setIsRunning(false);
            return 100;
          }
          return next;
        });
      }, 80);
      return () => clearInterval(interval);
    }
  }, [isRunning]);

  const startProgress = () => {
    setProgress(0);
    setIsRunning(true);
  };

  const resetProgress = () => {
    setProgress(0);
    setIsRunning(false);
  };

  return (
    <div className="relative">
      <TorusFieldProgress
        progress={progress}
        title="QUANTUM FIELD"
        subtitle="INITIALIZATION"
      />

      {/* Demo Controls */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 pointer-events-auto flex gap-4">
        <button
          onClick={startProgress}
          disabled={isRunning}
          className="px-4 py-2 bg-cyan-400 bg-opacity-20 border border-cyan-400 rounded font-mono text-cyan-400 hover:bg-opacity-30 transition-all disabled:opacity-50"
        >
          START
        </button>
        <button
          onClick={resetProgress}
          className="px-4 py-2 bg-gray-600 bg-opacity-20 border border-gray-400 rounded font-mono text-gray-400 hover:bg-opacity-30 transition-all"
        >
          RESET
        </button>
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={(e) => {
            setProgress(parseInt(e.target.value));
            setIsRunning(false);
          }}
          className="w-32"
        />
      </div>
    </div>
  );
};

export default TorusProgressDemo;
