// Demo component showing different configurations
export const GlitchTextDemo = () => {
  return (
    <div className="min-h-screen bg-black text-green-400 p-8 font-mono">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-cyan-400">
            Cyberpunk Glitch Text Demo
          </h1>
          <p className="text-gray-400">
            Hover over the text to trigger glitch effects
          </p>
        </div>

        <div className="space-y-8">
          <div className="border border-green-400 border-opacity-30 rounded-lg p-6 bg-green-400 bg-opacity-5">
            <h3 className="text-xl mb-4 text-cyan-400">Low Intensity</h3>
            <div className="text-2xl">
              <GlitchText intensity="low" className="text-green-400">
                QUANTUM MATRIX
              </GlitchText>
            </div>
          </div>

          <div className="border border-green-400 border-opacity-30 rounded-lg p-6 bg-green-400 bg-opacity-5">
            <h3 className="text-xl mb-4 text-cyan-400">Medium Intensity</h3>
            <div className="text-3xl">
              <GlitchText intensity="medium" className="text-green-400">
                NEURAL LINK
              </GlitchText>
            </div>
          </div>

          <div className="border border-green-400 border-opacity-30 rounded-lg p-6 bg-green-400 bg-opacity-5">
            <h3 className="text-xl mb-4 text-cyan-400">High Intensity</h3>
            <div className="text-3xl">
              <GlitchText intensity="high" className="text-green-400">
                CYBER PUNK
              </GlitchText>
            </div>
          </div>

          <div className="border border-green-400 border-opacity-30 rounded-lg p-6 bg-green-400 bg-opacity-5">
            <h3 className="text-xl mb-4 text-cyan-400">Extreme Intensity</h3>
            <div className="text-4xl">
              <GlitchText intensity="extreme" className="text-green-400">
                NEXUS CORE
              </GlitchText>
            </div>
          </div>

          <div className="border border-green-400 border-opacity-30 rounded-lg p-6 bg-green-400 bg-opacity-5">
            <h3 className="text-xl mb-4 text-cyan-400">
              Auto Glitch (Every 2 seconds)
            </h3>
            <div className="text-3xl">
              <GlitchText
                intensity="medium"
                autoGlitch={true}
                autoGlitchInterval={2000}
                triggerOnHover={false}
                className="text-green-400"
              >
                DATA STREAM
              </GlitchText>
            </div>
          </div>

          <div className="border border-green-400 border-opacity-30 rounded-lg p-6 bg-green-400 bg-opacity-5">
            <h3 className="text-xl mb-4 text-cyan-400">In Sentence Context</h3>
            <div className="text-xl leading-relaxed">
              Welcome to the{' '}
              <GlitchText intensity="high" className="text-cyan-400 font-bold">
                MATRIX
              </GlitchText>{' '}
              where reality becomes{' '}
              <GlitchText intensity="medium" className="text-red-400 font-bold">
                CORRUPTED
              </GlitchText>{' '}
              and data flows like{' '}
              <GlitchText intensity="low" className="text-yellow-400 font-bold">
                ELECTRICITY
              </GlitchText>
              .
            </div>
          </div>
        </div>

        <div className="text-center text-gray-500 text-sm">
          <p>
            Component props: intensity, triggerOnHover, autoGlitch,
            autoGlitchInterval, className
          </p>
        </div>
      </div>
    </div>
  );
};
