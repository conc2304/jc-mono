import { ButtonDemo } from '@jc/ui-components';

export default function Page() {
  const gridConfig = {
    // Background colors
    backgroundColor: 'transparent',

    // Grid line colors
    fineGridColor: 'rgba(0, 0, 0, 0.05)',
    mediumGridColor: 'rgba(0, 0, 0, 0.04)',
    majorGridColor: '#aaa',

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
  return (
    <div
      style={{
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
      }}
    >
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
    </div>
  );
}
