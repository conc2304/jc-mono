import React, { useEffect, useRef } from 'react';

const CyberpunkBootSequence = () => {
  const containerRef = useRef(null);
  const bootTextRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const progressRef = useRef(null);
  const statusRef = useRef(null);

  useEffect(() => {
    // Load GSAP and SplitText from CDN
    const loadGSAP = () => {
      return new Promise((resolve) => {
        if (window.gsap && window.SplitText) {
          resolve();
          return;
        }

        const script1 = document.createElement('script');
        script1.src =
          'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
        script1.onload = () => {
          const script2 = document.createElement('script');
          script2.src =
            'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/TextPlugin.min.js';
          script2.onload = resolve;
          document.head.appendChild(script2);
        };
        document.head.appendChild(script1);
      });
    };

    const alienFonts = [
      'Wingdings',
      'Webdings',
      'Symbol',
      'Zapf Dingbats',
      'Fantasy',
    ];

    const bootMessages = [
      '> INITIALIZING QUANTUM CORE...',
      '> LOADING NEURAL PATHWAYS...',
      '> DECRYPTING MEMORY BANKS...',
      '> ESTABLISHING SECURE PROTOCOLS...',
      '> SYNCHRONIZING TEMPORAL MATRICES...',
      '> ACTIVATING DEFENSE SYSTEMS...',
      '> CALIBRATING SENSORY ARRAYS...',
      '> LOADING USER INTERFACE...',
      '> AUTHENTICATION VERIFIED...',
      '> SYSTEM FULLY OPERATIONAL...',
      '',
      'WELCOME TO THE NEXUS',
      'ACCESS GRANTED',
    ];

    const initAnimations = () => {
      const { gsap } = window;

      // Create timeline
      const tl = gsap.timeline();

      // Initial setup
      gsap.set(
        [
          titleRef.current,
          subtitleRef.current,
          bootTextRef.current,
          progressRef.current,
          statusRef.current,
        ],
        {
          opacity: 0,
        }
      );

      // Title animation with glitch
      tl.to(titleRef.current, {
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out',
      }).to(
        titleRef.current,
        {
          scale: 1.02,
          duration: 0.1,
          yoyo: true,
          repeat: 1,
          ease: 'power2.inOut',
        },
        '+=0.2'
      );

      // Subtitle
      tl.to(
        subtitleRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
        },
        '-=0.3'
      );

      // Boot text animation
      tl.to(
        bootTextRef.current,
        {
          opacity: 1,
          duration: 0.3,
        },
        '+=0.5'
      );

      // Animate each boot message
      let currentIndex = 0;
      const animateBootText = () => {
        if (currentIndex < bootMessages.length) {
          const message = bootMessages[currentIndex];

          if (message === '') {
            // Empty line pause
            setTimeout(() => {
              currentIndex++;
              animateBootText();
            }, 300);
            return;
          }

          // Create new line element
          const line = document.createElement('div');
          line.className = 'boot-line';
          line.textContent = message;
          bootTextRef.current.appendChild(line);

          // Typing animation
          gsap.fromTo(
            line,
            {
              width: 0,
              opacity: 0,
            },
            {
              width: 'auto',
              opacity: 1,
              duration: message.length * 0.02 + 0.3,
              ease: 'none',
              onComplete: () => {
                // Random glitch chance
                if (Math.random() < 0.3) {
                  createGlitchEffect(line);
                }

                setTimeout(() => {
                  currentIndex++;
                  animateBootText();
                }, 100);
              },
            }
          );
        } else {
          // Show progress bar
          gsap.to(progressRef.current, {
            opacity: 1,
            duration: 0.5,
            delay: 0.5,
            onComplete: () => {
              // Animate progress fill
              const progressFill =
                progressRef.current.querySelector('.progress-fill');
              gsap.to(progressFill, {
                width: '100%',
                duration: 2,
                ease: 'power2.out',
                onComplete: () => {
                  // Show final status
                  gsap.to(statusRef.current, {
                    opacity: 1,
                    scale: 1,
                    duration: 0.8,
                    ease: 'back.out(1.7)',
                  });
                },
              });
            },
          });
        }
      };

      // Start boot sequence after initial animations
      setTimeout(animateBootText, 2000);

      // Random background glitches
      setInterval(() => {
        if (Math.random() < 0.1) {
          const container = containerRef.current;
          gsap.to(container, {
            filter: 'brightness(1.3) contrast(1.2) hue-rotate(5deg)',
            duration: 0.05,
            yoyo: true,
            repeat: 1,
            ease: 'power2.inOut',
          });
        }
      }, 1000);

      // Random text glitches on existing text
      setInterval(() => {
        const allLines = bootTextRef.current.querySelectorAll('.boot-line');
        if (allLines.length > 0 && Math.random() < 0.2) {
          const randomLine =
            allLines[Math.floor(Math.random() * allLines.length)];
          createGlitchEffect(randomLine);
        }
      }, 2000);
    };

    const createGlitchEffect = (element) => {
      const originalText = element.textContent;
      const words = originalText.split(' ');
      const { gsap } = window;

      // Pick random word(s) to glitch
      const glitchIndices = [];
      for (let i = 0; i < words.length; i++) {
        if (Math.random() < 0.4) {
          glitchIndices.push(i);
        }
      }

      if (glitchIndices.length === 0) return;

      const glitchChars = '█▓▒░▀▄▌▐│┤┐└┴┬├─┼╔╗╚╝║═╬◄►▲▼';
      const alienFonts = ['Wingdings', 'Webdings', 'Symbol'];

      glitchIndices.forEach((index) => {
        const originalWord = words[index];

        // Create glitch sequence
        const glitchFrames = [];

        // Frame 1: Random characters
        let glitchedWord = '';
        for (let i = 0; i < originalWord.length; i++) {
          glitchedWord +=
            glitchChars[Math.floor(Math.random() * glitchChars.length)];
        }
        glitchFrames.push({ text: glitchedWord, font: 'JetBrains Mono' });

        // Frame 2: Alien font
        glitchFrames.push({
          text: originalWord,
          font: alienFonts[Math.floor(Math.random() * alienFonts.length)],
        });

        // Frame 3: More random chars
        glitchedWord = '';
        for (let i = 0; i < originalWord.length; i++) {
          glitchedWord +=
            glitchChars[Math.floor(Math.random() * glitchChars.length)];
        }
        glitchFrames.push({ text: glitchedWord, font: 'JetBrains Mono' });

        // Animate glitch sequence
        let frameIndex = 0;
        const glitchInterval = setInterval(() => {
          if (frameIndex < glitchFrames.length) {
            const frame = glitchFrames[frameIndex];
            words[index] = frame.text;
            element.textContent = words.join(' ');
            element.style.fontFamily = frame.font;

            // Add color glitch
            if (frameIndex === 1) {
              element.style.color = '#ff0080';
              element.style.textShadow = '2px 0 #00ffff, -2px 0 #ff0080';
            }

            frameIndex++;
          } else {
            // Restore original
            words[index] = originalWord;
            element.textContent = words.join(' ');
            element.style.fontFamily = 'JetBrains Mono';
            element.style.color = '#00ff88';
            element.style.textShadow = 'none';
            clearInterval(glitchInterval);
          }
        }, 80);
      });
    };

    loadGSAP().then(initAnimations);
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-black text-green-400 font-mono overflow-hidden relative"
      style={{
        background: 'radial-gradient(ellipse at center, #0a0a0a 0%, #000 70%)',
        fontFamily: 'JetBrains Mono, monospace',
      }}
    >
      {/* Scanlines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(transparent 50%, rgba(0, 255, 136, 0.03) 50%)',
          backgroundSize: '100% 4px',
          animation: 'scanlines 0.1s linear infinite',
        }}
      />

      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 136, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 136, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'gridPulse 4s ease-in-out infinite',
        }}
      />

      <div className="flex items-center justify-center min-h-screen p-8">
        <div className="max-w-4xl w-full">
          {/* Main Title */}
          <div
            ref={titleRef}
            className="text-center mb-4"
            style={{ fontFamily: 'Orbitron, monospace' }}
          >
            <h1 className="text-6xl font-black uppercase tracking-wider text-green-400 mb-2">
              NEXUS OS
            </h1>
          </div>

          {/* Subtitle */}
          <div
            ref={subtitleRef}
            className="text-center mb-12 opacity-0 transform translate-y-4"
          >
            <p className="text-lg text-green-300 uppercase tracking-widest">
              Quantum Neural Interface v3.7.2
            </p>
          </div>

          {/* Boot Text Container */}
          <div
            ref={bootTextRef}
            className="bg-black bg-opacity-50 border border-green-400 border-opacity-30 rounded-lg p-6 mb-8 backdrop-blur-sm"
            style={{
              minHeight: '400px',
              fontFamily: 'JetBrains Mono, monospace',
            }}
          >
            {/* Boot messages will be added here dynamically */}
          </div>

          {/* Progress Bar */}
          <div ref={progressRef} className="opacity-0 mb-6">
            <div className="w-full bg-gray-900 rounded-full h-2 mb-2">
              <div
                className="progress-fill h-2 rounded-full bg-gradient-to-r from-green-400 to-cyan-400"
                style={{
                  width: '0%',
                  boxShadow: '0 0 20px rgba(0, 255, 136, 0.5)',
                }}
              />
            </div>
            <p className="text-xs text-green-300 text-center">
              SYSTEM INITIALIZATION
            </p>
          </div>

          {/* Final Status */}
          <div
            ref={statusRef}
            className="text-center opacity-0 transform scale-95"
          >
            <div className="inline-block border border-green-400 rounded-lg px-8 py-4 bg-green-400 bg-opacity-10">
              <p className="text-2xl font-bold text-green-400 uppercase tracking-wider">
                ACCESS GRANTED
              </p>
              <p className="text-sm text-green-300 mt-1">
                Welcome to your portfolio
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Orbitron:wght@400;700;900&display=swap');

        @keyframes scanlines {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(4px);
          }
        }

        @keyframes gridPulse {
          0%,
          100% {
            opacity: 0.1;
          }
          50% {
            opacity: 0.3;
          }
        }

        .boot-line {
          white-space: nowrap;
          overflow: hidden;
          margin: 4px 0;
          color: #00ff88;
          font-family: 'JetBrains Mono', monospace;
        }

        .boot-line:last-child {
          color: #00ffff;
          font-weight: bold;
          font-size: 1.1em;
        }
      `}</style>
    </div>
  );
};

export default CyberpunkBootSequence;
