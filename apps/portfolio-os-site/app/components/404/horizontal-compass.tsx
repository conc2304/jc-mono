import React, {
  useState,
  useEffect,
  useRef,
  ReactNode,
  useCallback,
} from 'react';
import { Box, Typography } from '@mui/material';
import { styled, SxProps, Theme } from '@mui/material/styles';

// Type definitions
interface Cardinal {
  name: string;
  degree: number;
}

interface MinorTickConfig {
  degree: number;
}

interface CompassDimensions {
  width: number;
  height: number;
}

interface VisibilityBounds {
  cardinalMin: number;
  cardinalMax: number;
  minorMin: number;
  minorMax: number;
}

interface CardinalComponentProps {
  name: string;
  degree: number;
  position: number;
}

interface HorizontalCompassProps {
  customCenterMarker?: ReactNode;
  customCardinalComponent?: React.ComponentType<CardinalComponentProps>;
  showCurrentDegree?: boolean;
  showGridLines?: boolean;
  width?: string | number;
  height?: string | number;
  minorTickCount?: number;
  minorTickSx?: SxProps<Theme>;
}

interface StyledComponentProps {
  compassHeight?: number;
}

const minCompassHeight = 20;

// Styled components
const CompassContainer = styled(Box)<object>(() => ({
  position: 'relative',
  width: '100%',
  height: '100%',
  minHeight: `${minCompassHeight}px`,
  overflow: 'hidden',
}));

const GridLine = styled(Box)<object>({
  flex: 1,
  borderLeft: '1px solid #374151', // gray-700
  '&:first-of-type': {
    borderLeft: 'none',
  },
});

const GridContainer = styled(Box)<object>({
  position: 'absolute',
  inset: 0,
  display: 'flex',
});

const CardinalContainer = styled(Box)<object>({
  position: 'absolute',
  transform: 'translateX(-50%)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const CardinalName = styled(Typography)<object>({
  fontSize: '0.75rem',
  fontWeight: 'bold',
  color: '#22d3ee', // cyan-400
  marginTop: '0.25rem',
});

const CardinalDegree = styled(Typography)<object>({
  fontSize: '0.75rem',
  color: '#9ca3af', // gray-400
});

const MajorTick = styled(Box)<StyledComponentProps>(({ compassHeight }) => ({
  width: '2px',
  height: compassHeight ? Math.max(compassHeight * 0.25, 16) : 16, // 25% of compass height, min 16px
  backgroundColor: '#22d3ee', // cyan-400
  marginTop: '0.25rem',
}));

const MinorTick = styled(Box)<StyledComponentProps>(({ compassHeight }) => ({
  position: 'absolute',
  width: '2px',
  height: compassHeight ? Math.max(compassHeight * 0.125, 8) : 8, // 12.5% of compass height, min 8px
}));

const CenterMarkerContainer = styled(Box)<object>({
  position: 'absolute',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, 0px)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const DefaultCenterLine = styled(Box)<object>({
  width: '2px',
  height: '100%',
  backgroundColor: '#ef4444', // red-500
});

const DefaultCenterDiamond = styled(Box)<StyledComponentProps>(
  ({ compassHeight }) => {
    const actualHeight = compassHeight || minCompassHeight;
    const size = Math.max(actualHeight * 0.167, 12); // ~16% of compass height, min 12px
    return {
      position: 'absolute',
      top: Math.max(actualHeight * 0.083, 8), // ~8% from top
      width: `${size}px`,
      height: `${size}px`,
      border: '2px solid #ef4444',
      backgroundColor: '#ef4444',
      transform: 'rotate(45deg) translateY(-50%)',
    };
  }
);

const DegreeDisplay = styled(Typography)<object>({
  position: 'absolute',
  bottom: '0.25rem',
  left: '50%',
  transform: 'translateX(-50%)',
  fontSize: '0.75rem',
  color: '#f87171', // red-400
  fontWeight: 'bold',
  fontFamily: 'monospace',
});

export const HorizontalCompass: React.FC<HorizontalCompassProps> = ({
  customCenterMarker = null,
  customCardinalComponent = null,
  showCurrentDegree = true,
  showGridLines = true,
  width = '100%',
  height = `${minCompassHeight}px`,
  minorTickSx = {},
  minorTickCount = 4,
}) => {
  const [mouseX, setMouseX] = useState<number>(0);
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);
  const [compassDimensions, setCompassDimensions] = useState<CompassDimensions>(
    {
      width: 384,
      height: minCompassHeight,
    }
  );
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const compassRef = useRef<HTMLDivElement>(null);

  // Cardinal directions with their degree positions
  const cardinals: Cardinal[] = [
    { name: 'N', degree: 0 },
    { name: 'NE', degree: 45 },
    { name: 'E', degree: 90 },
    { name: 'SE', degree: 135 },
    { name: 'S', degree: 180 },
    { name: 'SW', degree: 225 },
    { name: 'W', degree: 270 },
    { name: 'NW', degree: 315 },
  ];

  // Generate minor tick positions
  const generateMinorTicks = (): MinorTickConfig[] => {
    const minorTicks: MinorTickConfig[] = [];
    const degreesPerMajorTick = 45;
    const degreesPerMinorTick = degreesPerMajorTick / (minorTickCount + 1);

    for (
      let majorDegree = 0;
      majorDegree < 360;
      majorDegree += degreesPerMajorTick
    ) {
      for (let i = 1; i <= minorTickCount; i++) {
        const minorDegree = majorDegree + i * degreesPerMinorTick;
        minorTicks.push({ degree: minorDegree % 360 });
      }
    }
    return minorTicks;
  };

  // Update compass dimensions
  const updateCompassDimensions = useCallback((): void => {
    if (compassRef.current) {
      const rect = compassRef.current.getBoundingClientRect();
      const newDimensions = {
        width: rect.width,
        height: Math.max(rect.height, minCompassHeight),
      };

      setCompassDimensions(newDimensions);
      if (!isInitialized) {
        setIsInitialized(true);
      }
    }
  }, [isInitialized]);

  // Default Cardinal Component
  const DefaultCardinalComponent: React.FC<CardinalComponentProps> = ({
    name,
    degree,
    position,
  }) => (
    <CardinalContainer style={{ left: `${position}px` }}>
      <CardinalName>{name}</CardinalName>
      <CardinalDegree>{degree}°</CardinalDegree>
      <MajorTick compassHeight={compassDimensions.height} />
    </CardinalContainer>
  );

  // Default Center Marker Component
  const DefaultCenterMarker: React.FC = () => (
    <>
      <DefaultCenterLine />
      <DefaultCenterDiamond compassHeight={compassDimensions.height} />
    </>
  );

  const minorTicks = generateMinorTicks();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent): void => {
      setMouseX(e.clientX);
    };

    const handleResize = (): void => {
      setScreenWidth(window.innerWidth);
      updateCompassDimensions();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, [updateCompassDimensions]);

  // Update compass dimensions when component mounts or dimensions change
  useEffect(() => {
    // Use a timeout to ensure the component is fully rendered
    const timer = setTimeout(() => {
      updateCompassDimensions();
    }, 0);

    return () => clearTimeout(timer);
  }, [width, height, updateCompassDimensions]);

  // Additional effect to handle initial mounting and ensure dimensions are captured
  useEffect(() => {
    if (compassRef.current && !isInitialized) {
      updateCompassDimensions();
    }
  }, [isInitialized, updateCompassDimensions]);

  // Convert mouse X position to degrees (0-360)
  const currentDegree: number = (mouseX / screenWidth) * 360;

  // Calculate position of each cardinal direction
  const getCardinalPosition = (cardinalDegree: number): number => {
    let diff = cardinalDegree - currentDegree;

    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;

    const compassWidth = compassDimensions.width;
    const position = compassWidth / 2 + diff * (compassWidth / 180);

    return position;
  };

  // Calculate visibility bounds based on actual compass width
  const getVisibilityBounds = (): VisibilityBounds => {
    const buffer = Math.max(compassDimensions.width * 0.05, 20); // 5% of width or 20px buffer
    return {
      cardinalMin: -buffer,
      cardinalMax: compassDimensions.width + buffer,
      minorMin: -buffer / 2,
      minorMax: compassDimensions.width + buffer / 2,
    };
  };

  const bounds = getVisibilityBounds();

  return (
    <Box height={height}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        width={width}
        height={height}
      >
        <CompassContainer ref={compassRef}>
          {showGridLines && (
            <GridContainer>
              {[...Array(9)].map((_, i) => (
                <GridLine key={i} />
              ))}
            </GridContainer>
          )}

          {/* Only render content after dimensions are initialized */}
          {isInitialized && (
            <>
              {/* Cardinal Direction Markers */}
              {cardinals.map((cardinal) => {
                const position = getCardinalPosition(cardinal.degree);
                const isVisible =
                  position >= bounds.cardinalMin &&
                  position <= bounds.cardinalMax;

                if (!isVisible) return null;

                const CardinalComponent =
                  customCardinalComponent || DefaultCardinalComponent;

                return (
                  <CardinalComponent
                    key={cardinal.name}
                    name={cardinal.name}
                    degree={cardinal.degree}
                    position={position}
                  />
                );
              })}

              {/* Minor Tick Marks */}
              {minorTicks.map((tick, index) => {
                const position = getCardinalPosition(tick.degree);
                const isVisible =
                  position >= bounds.minorMin && position <= bounds.minorMax;

                return isVisible ? (
                  <MinorTick
                    className={`minor-${index}`}
                    key={`minor-${index}`}
                    style={{ left: `${position}px` }}
                    compassHeight={compassDimensions.height}
                    sx={{ ...minorTickSx }}
                  />
                ) : null;
              })}

              {/* Center Marker */}
              <CenterMarkerContainer>
                {customCenterMarker || <DefaultCenterMarker />}
              </CenterMarkerContainer>

              {/* Degree Scale */}
              {showCurrentDegree && (
                <DegreeDisplay>{currentDegree.toFixed(0)}°</DegreeDisplay>
              )}
            </>
          )}
        </CompassContainer>
      </Box>
    </Box>
  );
};
