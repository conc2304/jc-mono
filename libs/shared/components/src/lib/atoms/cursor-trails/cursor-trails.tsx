import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';

import { Property } from 'csstype';

export interface CursorTrailConfig {
  // Trail settings
  trailLength?: number;
  trailDecayRate?: number;
  trailScaleDecay?: number;
  trailMinScale?: number;

  // Physics settings
  gravity?: number;
  airResistance?: number;
  wallBounce?: number;
  groundBounce?: number;
  groundFriction?: number;
  velocityDamping?: number;

  // Flopping settings
  floorHeight?: number;
  flopCountMin?: number;
  flopCountMax?: number;
  flopHeightMin?: number;
  flopHeightMax?: number;
  flopDuration?: number;
  flopDelayMin?: number;
  flopDelayMax?: number;
  initialFlopDelayMax?: number;

  // Return animation settings
  returnDuration?: number;
  returnStagger?: number;
  returnDurationVariation?: number;
  returnEaseStrength?: number;
  returnWobbleAmount?: number;

  // Visual settings
  cursorSize?: number;
  normalOpacity?: number;
  settledOpacity?: number;
  returnGlowColor?: Property.Color;
  returnTintColor?: Property.Color;
  cursorColor?: Property.Color;

  // Velocity settings
  velocityMultiplier?: number;
  velocityHistoryLength?: number;

  // Settlement thresholds
  settlementVelocityThreshold?: number;
  settlementHorizontalThreshold?: number;
}

export const CursorTrail = ({
  // Trail settings
  trailLength = 8,
  trailDecayRate = 0.15,
  trailScaleDecay = 0.1,
  trailMinScale = 0.3,

  // Physics settings
  gravity = 0.8,
  airResistance = 0.98,
  wallBounce = 0.7,
  groundBounce = 0.7,
  groundFriction = 0.8,
  velocityDamping = 0.5,

  // Flopping settings
  floorHeight = 0,
  flopCountMin = 2,
  flopCountMax = 6,
  flopHeightMin = 15,
  flopHeightMax = 25,
  flopDuration = 400,
  flopDelayMin = 500,
  flopDelayMax = 2000,
  initialFlopDelayMax = 2000,

  // Return animation settings
  returnDuration = 800,
  returnStagger = 50,
  returnDurationVariation = 30,
  returnEaseStrength = 3,
  returnWobbleAmount = 5,

  // Visual settings
  cursorSize = 24,
  normalOpacity = 1,
  settledOpacity = 0.6,
  returnGlowColor = 'rgba(59, 130, 246, 0.5)',
  returnTintColor = '#dbeafe',
  cursorColor = 'white',

  // Velocity settings
  velocityMultiplier = 0.5,
  velocityHistoryLength = 4,

  // Settlement thresholds
  settlementVelocityThreshold = 2,
  settlementHorizontalThreshold = 1,

  // UI settings
  style = {},
}) => {
  const [trail, setTrail] = useState([]);
  const [isFalling, setIsFalling] = useState(false);
  const [isReturning, setIsReturning] = useState(false);
  const trailRef = useRef([]);
  const fallingCursorsRef = useRef([]);
  const returningCursorsRef = useRef([]);
  const animationRef = useRef();
  const lastPositionsRef = useRef([]);
  const containerRef = useRef();

  // Performance optimizations
  const screenDimensionsRef = useRef({ width: 0, height: 0 });
  const lastFrameTimeRef = useRef(0);
  const TARGET_FPS = 60;
  const FRAME_INTERVAL = 1000 / TARGET_FPS;

  // Memoized container styles
  const containerStyle = useMemo(
    () => ({
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: 'none',
      zIndex: 50,
      willChange: 'transform', // GPU acceleration hint
      ...style,
    }),
    [style]
  );

  // Memoized SVG path
  const svgPath = useMemo(
    () =>
      'M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87c.45 0 .67-.54.35-.85L6.35 2.86a.5.5 0 0 0-.85.35Z',
    []
  );

  // Cache screen dimensions
  const updateScreenDimensions = useCallback(() => {
    screenDimensionsRef.current = {
      width: window.innerWidth,
      height: window.innerHeight - floorHeight,
    };
  }, []);

  // Throttled mouse move handler
  const throttledMouseMove = useCallback(
    (e) => {
      const now = performance.now();
      if (now - lastFrameTimeRef.current < FRAME_INTERVAL) return;

      const newPosition = {
        x: e.clientX,
        y: e.clientY,
        id: now, // Use performance.now for better precision
      };

      // Calculate velocity based on previous position
      const prevPosition = lastPositionsRef.current[0];
      if (prevPosition) {
        newPosition.vx = (newPosition.x - prevPosition.x) * velocityMultiplier;
        newPosition.vy = (newPosition.y - prevPosition.y) * velocityMultiplier;
      } else {
        newPosition.vx = 0;
        newPosition.vy = 0;
      }

      lastPositionsRef.current = [
        newPosition,
        ...lastPositionsRef.current.slice(0, velocityHistoryLength - 1),
      ];

      if (isFalling || isReturning) {
        // Start the return animation
        if (
          isFalling &&
          (fallingCursorsRef.current.length > 0 ||
            returningCursorsRef.current.length > 0)
        ) {
          setIsFalling(false);
          setIsReturning(true);

          // Convert falling/settled cursors to returning cursors
          const cursorsToReturn =
            fallingCursorsRef.current.length > 0
              ? fallingCursorsRef.current
              : returningCursorsRef.current;

          returningCursorsRef.current = cursorsToReturn.map(
            (cursor, index) => ({
              ...cursor,
              startX: cursor.x,
              startY:
                cursor.settled && cursor.flopY !== undefined
                  ? (cursor.groundY || cursor.y) + cursor.flopY
                  : cursor.y,
              targetX: newPosition.x,
              targetY: newPosition.y,
              returnStartTime: now + index * returnStagger,
              returnDuration: returnDuration + index * returnDurationVariation,
              settled: false,
              rotation: 0,
            })
          );

          fallingCursorsRef.current = [];
        }

        // Update target for returning cursors
        if (isReturning) {
          returningCursorsRef.current.forEach((cursor) => {
            cursor.targetX = newPosition.x;
            cursor.targetY = newPosition.y;
          });
        }
      } else {
        // Normal trail mode - limit array operations
        if (trailRef.current.length >= trailLength) {
          trailRef.current.pop(); // Remove last element
        }
        trailRef.current.unshift(newPosition); // Add to beginning

        // Batch state update
        setTrail([...trailRef.current]);
      }

      lastFrameTimeRef.current = now;
    },
    [
      isFalling,
      isReturning,
      trailLength,
      velocityMultiplier,
      velocityHistoryLength,
      returnStagger,
      returnDuration,
      returnDurationVariation,
    ]
  );

  const handleMouseLeave = useCallback(() => {
    if (trailRef.current.length > 0) {
      // Convert trail to falling cursors with physics properties
      fallingCursorsRef.current = trailRef.current.map((cursor) => ({
        ...cursor,
        vx: cursor.vx || 0,
        vy: cursor.vy || 0,
        ay: gravity,
        bounce: wallBounce,
        friction: airResistance,
        settled: false,
      }));
      setIsFalling(true);
      trailRef.current = [];
    }
  }, [gravity, wallBounce, airResistance]);

  const animateTrail = useCallback(() => {
    const now = performance.now();

    // Frame rate limiting
    if (now - lastFrameTimeRef.current < FRAME_INTERVAL) {
      animationRef.current = requestAnimationFrame(animateTrail);
      return;
    }

    const { width: screenWidth, height: screenHeight } =
      screenDimensionsRef.current;

    if (isReturning && returningCursorsRef.current.length > 0) {
      let allReturned = true;

      // Use for loop for better performance than map
      for (let i = 0; i < returningCursorsRef.current.length; i++) {
        const cursor = returningCursorsRef.current[i];

        if (now < cursor.returnStartTime) {
          allReturned = false;
          continue;
        }

        const elapsed = now - cursor.returnStartTime;
        const progress = Math.min(elapsed / cursor.returnDuration, 1);

        // Smooth easing function (customizable ease-out)
        const easedProgress = 1 - Math.pow(1 - progress, returnEaseStrength);

        // Interpolate position
        cursor.x =
          cursor.startX + (cursor.targetX - cursor.startX) * easedProgress;
        cursor.y =
          cursor.startY + (cursor.targetY - cursor.startY) * easedProgress;

        // Add some organic movement during return
        const wobble =
          Math.sin(elapsed * 0.01) * (1 - progress) * returnWobbleAmount;
        cursor.x += wobble;

        if (progress < 1) {
          allReturned = false;
        }
      }

      // When all cursors have returned, switch to normal trail mode
      if (allReturned) {
        setIsReturning(false);
        // Convert returning cursors to trail format and merge with new trail
        const returnedCursors = returningCursorsRef.current.map((cursor) => ({
          x: cursor.x,
          y: cursor.y,
          id: cursor.id,
          vx: 0,
          vy: 0,
        }));

        trailRef.current = [...trailRef.current, ...returnedCursors].slice(
          0,
          trailLength
        );
        returningCursorsRef.current = [];
      }

      setTrail([...returningCursorsRef.current]);
    } else if (isFalling && fallingCursorsRef.current.length > 0) {
      // Use for loop for better performance
      for (let i = 0; i < fallingCursorsRef.current.length; i++) {
        const cursor = fallingCursorsRef.current[i];

        // Handle settled cursors (dead fish flopping)
        if (cursor.settled) {
          if (!cursor.flopStartTime) {
            cursor.flopStartTime = now + Math.random() * initialFlopDelayMax;
            cursor.totalFlops =
              Math.floor(Math.random() * (flopCountMax - flopCountMin + 1)) +
              flopCountMin;
            cursor.currentFlop = 0;
            cursor.flopDuration = flopDuration;
            cursor.nextFlopTime = cursor.flopStartTime;
            cursor.isFlopping = false;
            cursor.groundY = cursor.y;
            cursor.flopY = 0;
          }

          if (
            now > cursor.flopStartTime &&
            cursor.currentFlop < cursor.totalFlops
          ) {
            if (!cursor.isFlopping && now >= cursor.nextFlopTime) {
              // Start a new flop
              cursor.isFlopping = true;
              cursor.flopStarted = now;
              cursor.currentFlop++;
            }

            if (cursor.isFlopping) {
              const flopElapsed = now - cursor.flopStarted;
              const flopProgress = Math.min(
                flopElapsed / cursor.flopDuration,
                1
              );

              if (flopProgress < 1) {
                // Parabolic jump motion
                const jumpHeight =
                  flopHeightMin +
                  Math.random() * (flopHeightMax - flopHeightMin);
                cursor.flopY =
                  -jumpHeight * 4 * flopProgress * (1 - flopProgress);

                // Slight rotation during flop
                const rotationVariation = Math.sin(flopProgress * Math.PI) * 20;
                cursor.rotation = 90 + rotationVariation;
              } else {
                // Flop finished
                cursor.isFlopping = false;
                cursor.flopY = 0;
                cursor.rotation = 90; // Back to horizontal

                // Schedule next flop with random delay
                const delay =
                  flopDelayMin + Math.random() * (flopDelayMax - flopDelayMin);
                cursor.nextFlopTime = now + delay;
              }
            }
          } else if (cursor.currentFlop >= cursor.totalFlops) {
            // All flops done, lie still
            cursor.flopY = 0;
            cursor.rotation = 90;
          }

          continue;
        }

        // Apply physics for falling cursors
        cursor.vy += cursor.ay; // gravity
        cursor.vx *= cursor.friction; // air resistance
        cursor.x += cursor.vx;
        cursor.y += cursor.vy;

        // Bounce off left and right walls
        if (cursor.x <= cursorSize / 2) {
          cursor.x = cursorSize / 2;
          cursor.vx = Math.abs(cursor.vx) * cursor.bounce;
        } else if (cursor.x >= screenWidth - cursorSize / 2) {
          cursor.x = screenWidth - cursorSize / 2;
          cursor.vx = -Math.abs(cursor.vx) * cursor.bounce;
        }

        // Bounce off ground
        if (cursor.y >= screenHeight - cursorSize - floorHeight) {
          cursor.y = screenHeight - cursorSize - floorHeight;
          cursor.vy = -Math.abs(cursor.vy) * groundBounce;
          cursor.vx *= groundFriction; // friction on ground

          // Settle if moving slowly
          if (
            Math.abs(cursor.vy) < settlementVelocityThreshold &&
            Math.abs(cursor.vx) < settlementHorizontalThreshold
          ) {
            cursor.settled = true;
            cursor.vx = 0;
            cursor.vy = 0;
            cursor.rotation = 90; // Lie horizontally on the ground
          }
        }

        // Bounce off ceiling
        if (cursor.y <= cursorSize / 2) {
          cursor.y = cursorSize / 2;
          cursor.vy = Math.abs(cursor.vy) * cursor.bounce;
        }
      }

      setTrail([...fallingCursorsRef.current]);
    } else if (
      !isFalling &&
      !isReturning &&
      trailRef.current.length > trailLength
    ) {
      // Normal trail animation - only filter if needed
      trailRef.current = trailRef.current.slice(0, trailLength);
      setTrail([...trailRef.current]);
    }

    lastFrameTimeRef.current = now;
    animationRef.current = requestAnimationFrame(animateTrail);
  }, [
    isReturning,
    isFalling,
    trailLength,
    returnEaseStrength,
    returnWobbleAmount,
    flopCountMin,
    flopCountMax,
    flopHeightMin,
    flopHeightMax,
    flopDuration,
    flopDelayMin,
    flopDelayMax,
    initialFlopDelayMax,
    cursorSize,
    groundBounce,
    groundFriction,
    settlementVelocityThreshold,
    settlementHorizontalThreshold,
  ]);

  useEffect(() => {
    updateScreenDimensions();
    window.addEventListener('resize', updateScreenDimensions);

    document.addEventListener('mousemove', throttledMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    animationRef.current = requestAnimationFrame(animateTrail);

    return () => {
      window.removeEventListener('resize', updateScreenDimensions);
      document.removeEventListener('mousemove', throttledMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [throttledMouseMove, handleMouseLeave, animateTrail]);

  // Memoized cursor renderer
  const renderCursor = useCallback(
    (position, index) => {
      const displayY =
        position.settled && position.flopY !== undefined
          ? (position.groundY || position.y) + position.flopY
          : position.y;

      // Handle different visual states
      let opacity, transform;

      if (isReturning) {
        // Returning cursors - full opacity, slight glow effect
        opacity = normalOpacity;
        transform = 'scale(1)';
      } else if (isFalling) {
        // Falling/settled cursors
        if (position.settled) {
          opacity =
            position.currentFlop >= position.totalFlops
              ? settledOpacity
              : normalOpacity;
        } else {
          opacity = normalOpacity;
        }

        if (position.rotation !== undefined) {
          transform = `scale(1) rotate(${position.rotation}deg)`;
        } else {
          transform = 'scale(1)';
        }
      } else {
        // Normal trail mode
        opacity = Math.max(0, normalOpacity - index * trailDecayRate);
        const scale = Math.max(trailMinScale, 1 - index * trailScaleDecay);
        transform = `scale(${scale})`;
      }

      // Optimized styles object
      const cursorStyle = {
        position: 'absolute',
        left: position.x - cursorSize / 2,
        top: displayY - cursorSize / 2,
        opacity: opacity,
        transform: transform,
        willChange: 'transform, opacity', // GPU acceleration hint
        transition: isFalling || isReturning ? 'none' : 'all 0.1s ease-out',
        filter: isReturning
          ? `drop-shadow(0 0 8px ${returnGlowColor})`
          : 'none',
      };

      return (
        <div key={position.id} style={cursorStyle}>
          <svg
            width={cursorSize}
            height={cursorSize}
            viewBox="0 0 24 24"
            fill="none"
            style={{
              filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.25))',
              willChange: 'transform', // GPU acceleration for SVG
            }}
          >
            <path
              d={svgPath}
              fill={isReturning ? returnTintColor : cursorColor}
              stroke="black"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );
    },
    [
      isReturning,
      isFalling,
      normalOpacity,
      settledOpacity,
      trailDecayRate,
      trailMinScale,
      trailScaleDecay,
      cursorSize,
      returnGlowColor,
      returnTintColor,
      cursorColor,
      svgPath,
    ]
  );

  return (
    <div ref={containerRef} style={containerStyle}>
      {trail.map(renderCursor)}
    </div>
  );
};
