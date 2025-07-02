// import { ConnectFour } from '@jc/games-lib';
import { styled, useTheme, ThemeSwitcher } from '@jc/theming';
import {
  BaseBeveledContainer,
  BeveledButton,
  BeveledCard,
  useMousePosition,
  // BeveledPanel,
} from '@jc/ui-components';

export function App() {
  const { themeName } = useTheme();

  const AppContainer = styled('div', {
    position: 'relative',
    minHeight: '100vh',
    padding: '$8',
    background:
      'linear-gradient(-45deg,rgb(79, 79, 79) 0%, rgb(165, 69, 69) 50%, rgb(62, 6, 6) 100%)',
  });

  const Header = styled('header', {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '$8',
    padding: '$6',
    backgroundColor: '$surface',
    borderRadius: '$lg',
    border: '1px solid $border',
  });

  const Title = styled('h1', {
    fontSize: '$4xl',
    fontWeight: '$bold',
    color: '$textPrimary',

    '.cyberpunk &': {
      color: '$primary',
      textShadow: '0 0 10px $primary',
    },
  });

  const { theme } = useTheme();

  const Content = () => (
    <div
      style={{ display: 'flex', maxWidth: '300px' }}
      key={Math.random() * 1000}
    >
      <div
        style={{
          width: '50px',
          height: '50px',
          background: 'red',
          marginRight: '10px',
          border: '1px solid black',
          flexShrink: 0,
          flexGrow: 0,
        }}
      ></div>
      <h3>
        some text content that I am going to make do stuff and maybe it should
        start wrapping
      </h3>
    </div>
  );

  return (
    <AppContainer>
      <Header>
        <Title>My {themeName} App</Title>
        <ThemeSwitcher />
      </Header>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignContent: 'center',
          color: 'white',
          marginBottom: '20px',
        }}
      >
        {new Array(3).fill(null).map(() => {
          return (
            <BaseBeveledContainer
              key={Math.random() * 1000}
              bevelConfig={{
                topLeft: { bevelSize: 30, bevelAngle: 45 },
                topRight: { bevelSize: 8, bevelAngle: 45 },
                bottomRight: { bevelSize: 30, bevelAngle: 45 },
                bottomLeft: { bevelSize: 10, bevelAngle: 45 },
              }}
              stepsConfig={{
                top: {
                  segments: [
                    // {
                    //   start: 0.25,
                    //   end: 0.5,
                    //   height: 15,
                    // },
                    {
                      start: 0.5,
                      end: 1,
                      height: 30,
                    },
                  ],
                },
                right: {
                  // segments: [
                  //   {
                  //     start: 0,
                  //     end: 0.5,
                  //     height: 15,
                  //   },
                  // ],
                },
              }}
              shadowConfig={{
                target: { type: 'mouse' },
                maxShadowDistance: 30,
                smoothing: 0.8,
              }}
              stroke="#00ffff"
              strokeWidth={3}
            >
              <Content />
            </BaseBeveledContainer>
          );
        })}
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignContent: 'center',
          color: 'white',
        }}
      >
        {new Array(3).fill(null).map(() => (
          <Content />
        ))}
      </div>
    </AppContainer>
  );
}

export default App;
