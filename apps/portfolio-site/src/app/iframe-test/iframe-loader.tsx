'use client';
import React, { useState, useRef } from 'react';

export const AudioVisualizerEmbed = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const iframeRef = useRef(null);

  const handleIframeLoad = () => {
    setIsLoading(false);
    setError(false);
    console.log('Audio visualizer loaded successfully');
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setError(true);
    console.error('Failed to load audio visualizer');
  };

  const reloadFrame = () => {
    if (iframeRef.current) {
      setIsLoading(true);
      setError(false);
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  const openInNewTab = () => {
    window.open('https://modest-darwin-601c1d.netlify.app', '_blank');
  };

  const toggleFullscreen = () => {
    const container = document.querySelector('.iframe-container');
    if (container) {
      if (!document.fullscreenElement) {
        container.requestFullscreen().catch((err) => {
          console.log('Error attempting to enable fullscreen:', err);
        });
      } else {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-5 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-5 text-green-400">
        Audio Visualizer - Vue.js Application
      </h1>

      <div className="bg-orange-500 text-white p-3 rounded mb-4 text-center text-sm">
        ⚠️ This site may require microphone permissions and audio interaction.
        Some features might not work properly in an iframe due to browser
        security restrictions.
      </div>

      <div className="iframe-container relative w-full h-[80vh] border-2 border-gray-600 rounded-lg overflow-hidden shadow-2xl">
        {isLoading && (
          <div className="absolute inset-0 bg-gray-800 flex items-center justify-center z-10">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mb-4"></div>
              <p className="text-gray-300">Loading audio visualizer...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 bg-red-900 flex items-center justify-center z-10">
            <div className="text-center">
              <p className="text-red-200 mb-4">
                Failed to load the audio visualizer
              </p>
              <button
                onClick={reloadFrame}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        <iframe
          ref={iframeRef}
          src="https://modest-darwin-601c1d.netlify.app/"
          title="Audio Visualizer Application"
          allow="microphone; camera; autoplay; fullscreen; web-share"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation"
          className="w-full h-full border-0 bg-white"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        />
      </div>

      <div className="text-center mt-4 space-x-2">
        <button
          onClick={reloadFrame}
          className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded transition-colors text-sm"
        >
          Reload iframe
        </button>
        <button
          onClick={openInNewTab}
          className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded transition-colors text-sm"
        >
          Open in New Tab
        </button>
        <button
          onClick={toggleFullscreen}
          className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded transition-colors text-sm"
        >
          Toggle Fullscreen
        </button>
      </div>

      <div className="mt-4 p-4 bg-gray-800 rounded text-sm leading-relaxed">
        <strong className="text-green-400">About this iframe:</strong>
        <br />
        • This loads the Vue.js audio visualizer application inside an iframe
        <br />
        • The app includes p5.js sketches, audio visualization, and interactive
        controls
        <br />
        • Some features like microphone access may require you to open it in a
        new tab
        <br />
        • The iframe includes permissions for microphone, camera, and autoplay
        <br />• You can interact with all the visualizer controls within the
        frame
      </div>
    </div>
  );
};
