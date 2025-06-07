// import { ConnectFour } from '@jc/games-lib';
import { styled, useTheme, ThemeSwitcher } from '@jc/theming';
import {
  BaseBeveledContainer,
  BeveledButton,
  BeveledCard,
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

  return (
    <AppContainer>
      <Header>
        <Title>My {themeName} App</Title>
        <ThemeSwitcher />
      </Header>
      {/* <div style={{ width: 'auto', height: '100px', padding: '15px' }}> */}
      {/* <BaseBeveledContainer
        background="linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)) url('https://t3.ftcdn.net/jpg/05/27/60/34/240_F_527603481_VUTQYCyYq0jPteCp7tQGueUQpfZp8tjQ.jpg') no-repeat center / cover"
        bevelConfig={{
          topLeft: { bevelSize: 20, bevelAngle: 45 },
          topRight: { bevelSize: 15, bevelAngle: 45 },
          bottomRight: { bevelSize: 80, bevelAngle: 45 },
          bottomLeft: { bevelSize: 10, bevelAngle: 45 },
        }}
        stepsConfig={{
          left: {
            segments: [
              {
                start: 0.1,
                end: 0.4,
                height: 10,
              },
              {
                end: 1 - 0.1,
                start: 1 - 0.4,
                height: 10,
              },
            ],
          },
        }}
        // fill={theme.colors.secondary}
        stroke={theme.colors.border}
        strokeWidth={3}
        glow={{
          color: 'black',
          intensity: 3,
          spread: 20,
          opacity: 0.4,
        }}
      >
        <h1 style={{ color: 'red', fontSize: '5rem', marginRight: '60px' }}>
          This is some text
        </h1>
      </BaseBeveledContainer> */}
      {/* </div> */}

      <BaseBeveledContainer
        bevelConfig={{
          topLeft: { bevelSize: 15, bevelAngle: 45 },
          topRight: { bevelSize: 30, bevelAngle: 45 },
          bottomRight: { bevelSize: 30, bevelAngle: 45 },
          bottomLeft: { bevelSize: 30, bevelAngle: 45 },
        }}
        stepsConfig={{
          top: {
            segments: [
              {
                start: 0.2,
                end: 1,
                height: 15,
              },
            ],
          },
          left: {
            segments: [
              {
                start: 0,
                end: 0.6,
                height: 15,
              },
              {
                start: 0.8,
                end: 0.5,
                height: 15,
              },
            ],
          },
        }}
        // background="rgba(2, 2, 2, 0.34)"
        // backgroundStyle={{
        //   background:
        //     'linear-gradient(rgba(17, 235, 255, 0.5), rgba(0, 0, 0, 0.5)), url("https://t3.ftcdn.net/jpg/05/27/60/34/240_F_527603481_VUTQYCyYq0jPteCp7tQGueUQpfZp8tjQ.jpg") no-repeat center / cover',
        // }}
        background='linear-gradient(rgba(17, 235, 255, 0.5), rgba(0, 0, 0, 0.5)), url("https://t3.ftcdn.net/jpg/05/27/60/34/240_F_527603481_VUTQYCyYq0jPteCp7tQGueUQpfZp8tjQ.jpg") no-repeat center / cover'
        stroke="#00ffff"
        strokeWidth={3}
        glow={{
          color: 'black',
          intensity: 4,
          spread: 0,
        }}
      >
        <div style={{ display: 'flex' }}>
          <div
            style={{
              width: '50px',
              height: '50px',
              background: 'red',
              border: '1px solid black',
            }}
          ></div>
          <h3> some text content that I am going to make </h3>
        </div>
      </BaseBeveledContainer>
    </AppContainer>
  );
}

export default App;
