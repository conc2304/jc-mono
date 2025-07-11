'use client';
import { alpha, styled, useTheme } from '@mui/material';
import { ButtonDemo } from '@jc/ui-components';

const StyledGridContainer = styled('div')(({ theme }) => {
  const gridConfig = {
    // Background colors
    backgroundColor: 'transparent',

    // Grid line colors
    fineGridColor: alpha(theme.palette.divider, 0.05),
    mediumGridColor: alpha(theme.palette.divider, 0.04),
    majorGridColor: theme.palette.divider,

    // Grid sizes
    largeGridSize: 80, // adjust this to your actual largeGridSize value
    smallGridDivisions: 5,
  };

  // Function to generate the configurable grid background
  function createGridBackground(config = gridConfig) {
    const {
      backgroundColor,
      fineGridColor,
      mediumGridColor,
      majorGridColor,
      largeGridSize,
    } = config;

    return `linear-gradient(-90deg, ${fineGridColor} 1px, transparent 1px),
        linear-gradient(${fineGridColor} 1px, transparent 1px),
        linear-gradient(-90deg, ${mediumGridColor} 1px, transparent 1px),
        linear-gradient(${mediumGridColor} 1px, transparent 1px),
        linear-gradient(transparent 3px, ${backgroundColor} 3px, ${backgroundColor} ${
      largeGridSize - 2 + 'px'
    }, transparent ${largeGridSize - 2 + 'px'}),
        linear-gradient(-90deg, ${majorGridColor} 1px, transparent 1px),
        linear-gradient(-90deg, transparent 3px, ${backgroundColor} 3px, ${backgroundColor} ${
      largeGridSize - 2 + 'px'
    }, transparent ${largeGridSize - 2 + 'px'}),
        linear-gradient(${majorGridColor} 1px, transparent 1px),
        ${backgroundColor}`;
  }

  const smPx = gridConfig.largeGridSize / gridConfig.smallGridDivisions + 'px';
  const lgPx = gridConfig.largeGridSize + 'px';
  return {
    width: '100%',
    height: '100%',
    background: createGridBackground(gridConfig),
    backgroundSize: `
        ${smPx} ${smPx},
        ${smPx} ${smPx},
        ${lgPx} ${lgPx},
        ${lgPx} ${lgPx},
        ${lgPx} ${lgPx},
        ${lgPx} ${lgPx},
        ${lgPx} ${lgPx},
        ${lgPx} ${lgPx}`,
  };
});
export default function Page() {
  return (
    <StyledGridContainer>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px',
          height: '100%',
        }}
      >
        <ButtonDemo />
      </div>
    </StyledGridContainer>
  );
}
