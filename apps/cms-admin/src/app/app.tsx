// import { ConnectFour } from '@jc/games-lib';
import { ReactNode } from 'react';
import { styled, useTheme, ThemeSwitcher } from '@jc/theming';
import {
  BaseBeveledContainer,
  BeveledButton,
  // BeveledButtonDemo,
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

  const FlexWrapper = ({ children }: { children?: ReactNode }) => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignContent: 'center',
        color: 'white',
        marginBottom: '20px',
      }}
    >
      {children}
    </div>
  );

  const BtnChild = () => <p>Click Me</p>;

  const DemoContainer = () => (
    <>
      <FlexWrapper>
        {new Array(3).fill(null).map((_, index) => {
          return (
            <BaseBeveledContainer
              key={index}
              bevelConfig={{
                topLeft: { bevelSize: 30, bevelAngle: 45 },
                topRight: { bevelSize: 8, bevelAngle: 45 },
                bottomRight: { bevelSize: 30, bevelAngle: 45 },
                bottomLeft: { bevelSize: 10, bevelAngle: 45 },
              }}
              stepsConfig={{
                top: {
                  segments: [
                    {
                      start: 0.5,
                      end: 1,
                      height: 30,
                    },
                  ],
                },
              }}
              shadowConfig={{
                target: { type: 'mouse' },
                maxShadowDistance: 30,
                smoothing: 0,
              }}
              // stroke="#00ffff"
              // strokeWidth={5}
            >
              <Content />
            </BaseBeveledContainer>
          );
        })}
      </FlexWrapper>

      <FlexWrapper>
        {new Array(3).fill(null).map((_, index) => (
          <Content key={index} />
        ))}
      </FlexWrapper>
    </>
  );

  return (
    <AppContainer>
      <Header>
        <Title>My {themeName} App</Title>
        <ThemeSwitcher />
      </Header>
      <DemoContainer />
      <FlexWrapper>
        <BeveledButton color="primary" variant="solid" size="sm">
          <BtnChild />
        </BeveledButton>
        <BeveledButton color="secondary" variant="outline" size="md">
          <BtnChild />
        </BeveledButton>
        <BeveledButton color="warning" variant="ghost" size="lg">
          <BtnChild />
        </BeveledButton>
        {/* <BeveledButtonDemo /> */}
      </FlexWrapper>
    </AppContainer>
  );
}

export default App;
