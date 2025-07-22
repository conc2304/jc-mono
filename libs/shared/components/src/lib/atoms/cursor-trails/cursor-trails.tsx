import React, { useState, useEffect, useRef } from 'react';

// TODO MAKE THIS MUI AND TS
const CursorTrail = () => {
  const [trail, setTrail] = useState([]);
  const [isFalling, setIsFalling] = useState(false);
  const [isReturning, setIsReturning] = useState(false);
  const trailRef = useRef([]);
  const fallingCursorsRef = useRef([]);
  const returningCursorsRef = useRef([]);
  const animationRef = useRef();
  const lastPositionsRef = useRef([]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const newPosition = {
        x: e.clientX,
        y: e.clientY,
        id: Date.now(),
      };

      // Calculate velocity based on previous position
      const prevPosition = lastPositionsRef.current[0];
      if (prevPosition) {
        newPosition.vx = (newPosition.x - prevPosition.x) * 0.5; // Damping factor
        newPosition.vy = (newPosition.y - prevPosition.y) * 0.5;
      } else {
        newPosition.vx = 0;
        newPosition.vy = 0;
      }

      lastPositionsRef.current = [
        newPosition,
        ...lastPositionsRef.current.slice(0, 4),
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
              returnStartTime: Date.now() + index * 50, // Stagger the return
              returnDuration: 800 + index * 30, // Varying return speeds
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
        // Normal trail mode
        trailRef.current = [newPosition, ...trailRef.current.slice(0, 19)];
        setTrail([...trailRef.current]);
      }
    };

    const handleMouseLeave = () => {
      if (trailRef.current.length > 0) {
        // Convert trail to falling cursors with physics properties
        fallingCursorsRef.current = trailRef.current.map((cursor, index) => ({
          ...cursor,
          vx: cursor.vx || 0,
          vy: cursor.vy || 0,
          ay: 0.8, // gravity
          bounce: 0.7, // bounce damping
          friction: 0.98, // air resistance
          settled: false,
        }));
        setIsFalling(true);
        trailRef.current = [];
      }
    };

    const handleMouseEnter = () => {
      // Don't immediately reset - let the mouse move handler trigger the return animation
    };

    const animateTrail = () => {
      if (isReturning && returningCursorsRef.current.length > 0) {
        const now = Date.now();
        let allReturned = true;

        returningCursorsRef.current = returningCursorsRef.current.map(
          (cursor) => {
            if (now < cursor.returnStartTime) {
              allReturned = false;
              return cursor;
            }

            const elapsed = now - cursor.returnStartTime;
            const progress = Math.min(elapsed / cursor.returnDuration, 1);

            // Smooth easing function (ease-out cubic)
            const easedProgress = 1 - Math.pow(1 - progress, 3);

            // Interpolate position
            cursor.x =
              cursor.startX + (cursor.targetX - cursor.startX) * easedProgress;
            cursor.y =
              cursor.startY + (cursor.targetY - cursor.startY) * easedProgress;

            // Add some organic movement during return
            const wobble = Math.sin(elapsed * 0.01) * (1 - progress) * 5;
            cursor.x += wobble;

            if (progress < 1) {
              allReturned = false;
            }

            return cursor;
          }
        );

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
            15
          );
          returningCursorsRef.current = [];
        }

        setTrail([...returningCursorsRef.current]);
      } else if (isFalling && fallingCursorsRef.current.length > 0) {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        fallingCursorsRef.current = fallingCursorsRef.current.map((cursor) => {
          // Handle settled cursors (dead fish flopping)
          if (cursor.settled) {
            if (!cursor.flopStartTime) {
              cursor.flopStartTime = Date.now() + Math.random() * 2000; // Random delay before flopping starts
              cursor.flopPhase = Math.random() * Math.PI * 2; // Random starting phase
              cursor.flopIntensity = 0.5 + Math.random() * 0.5; // Random flop intensity
              cursor.flopSpeed = 2 + Math.random() * 3; // Random flop speed
              cursor.groundY = cursor.y; // Remember ground position
            }

            const now = Date.now();
            if (now > cursor.flopStartTime) {
              // Dead fish flopping animation
              const timeSinceFlop = (now - cursor.flopStartTime) / 1000;
              const flopDecay = Math.exp(-timeSinceFlop * 0.3); // Gradually reduce flopping

              // Flopping rotation and position
              const flopAngle =
                Math.sin(timeSinceFlop * cursor.flopSpeed + cursor.flopPhase) *
                cursor.flopIntensity *
                flopDecay;
              const flopOffset =
                Math.sin(
                  timeSinceFlop * cursor.flopSpeed * 1.5 + cursor.flopPhase
                ) *
                3 *
                flopDecay;

              cursor.rotation = flopAngle * 30; // degrees
              cursor.flopY = flopOffset;
              cursor.flopDecay = flopDecay;
            }

            return cursor;
          }

          // Apply physics for falling cursors
          cursor.vy += cursor.ay; // gravity
          cursor.vx *= cursor.friction; // air resistance
          cursor.x += cursor.vx;
          cursor.y += cursor.vy;

          // Bounce off left and right walls
          if (cursor.x <= 12) {
            cursor.x = 12;
            cursor.vx = Math.abs(cursor.vx) * cursor.bounce;
          } else if (cursor.x >= screenWidth - 12) {
            cursor.x = screenWidth - 12;
            cursor.vx = -Math.abs(cursor.vx) * cursor.bounce;
          }

          // Bounce off ground
          if (cursor.y >= screenHeight - 24) {
            cursor.y = screenHeight - 24;
            cursor.vy = -Math.abs(cursor.vy) * cursor.bounce;
            cursor.vx *= 0.8; // friction on ground

            // Settle if moving slowly
            if (Math.abs(cursor.vy) < 2 && Math.abs(cursor.vx) < 1) {
              cursor.settled = true;
              cursor.vx = 0;
              cursor.vy = 0;
            }
          }

          // Bounce off ceiling
          if (cursor.y <= 12) {
            cursor.y = 12;
            cursor.vy = Math.abs(cursor.vy) * cursor.bounce;
          }

          return cursor;
        });

        setTrail([...fallingCursorsRef.current]);
      } else if (!isFalling && !isReturning) {
        // Normal trail animation
        trailRef.current = trailRef.current.filter((_, index) => index < 15);
        setTrail([...trailRef.current]);
      }

      animationRef.current = requestAnimationFrame(animateTrail);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    animationRef.current = requestAnimationFrame(animateTrail);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isFalling, isReturning]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {trail.map((position, index) => {
        const isFlopping =
          position.settled &&
          position.flopStartTime &&
          Date.now() > position.flopStartTime;
        const displayY =
          position.settled && position.flopY !== undefined
            ? (position.groundY || position.y) + position.flopY
            : position.y;

        // Handle different visual states
        let opacity, transform;

        if (isReturning) {
          // Returning cursors - full opacity, slight glow effect
          opacity = 1;
          transform = 'scale(1)';
        } else if (isFalling) {
          // Falling/settled cursors
          opacity = position.settled
            ? position.flopDecay
              ? Math.max(0.3, position.flopDecay)
              : 0.6
            : 1;
          transform = isFlopping
            ? `scale(1) rotate(${position.rotation || 0}deg)`
            : 'scale(1)';
        } else {
          // Normal trail mode
          opacity = Math.max(0, 1 - index * 0.15);
          transform = `scale(${Math.max(0.3, 1 - index * 0.1)})`;
        }

        return (
          <div
            key={position.id}
            className={`absolute ${
              isFalling || isReturning
                ? 'transition-none'
                : 'transition-all duration-100 ease-out'
            }`}
            style={{
              left: position.x - 12,
              top: displayY - 12,
              opacity: opacity,
              transform: transform,
              ...(isReturning && {
                filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))', // Blue glow during return
              }),
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="drop-shadow-lg"
            >
              <path
                d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87c.45 0 .67-.54.35-.85L6.35 2.86a.5.5 0 0 0-.85.35Z"
                fill={isReturning ? '#dbeafe' : 'white'} // Light blue tint during return
                stroke="black"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        );
      })}

      {/* Instructions */}
      <div className="absolute top-8 left-8 bg-black bg-opacity-80 text-white p-4 rounded-lg max-w-sm">
        <h2 className="text-lg font-bold mb-2">Cursor Trail Demo</h2>
        <p className="text-sm mb-2">
          Move your mouse around to see the cursor trail effect!
        </p>
        <p className="text-sm mb-2">
          🌟 <strong>Leave the screen:</strong> Watch cursors fall with physics
          and bounce!
        </p>
        <p className="text-sm mb-2">
          🐟 <strong>Wait:</strong> After settling, they'll flop around like
          dead fish!
        </p>
        <p className="text-sm mb-2">
          ✨ <strong>Return your mouse:</strong> Watch them gracefully ease back
          into following you!
        </p>
        <p className="text-xs text-gray-300">
          Each cursor has unique timing and smooth return animations with a blue
          glow.
        </p>
      </div>

      {/* Background pattern for better visibility */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      </div>
    </div>
  );
};

export default CursorTrail;
