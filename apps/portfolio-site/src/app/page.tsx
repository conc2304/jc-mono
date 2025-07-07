import { ReactNode } from 'react';
import { Button, ThemeSwitcher } from '@jc/theming';
import { BaseBeveledContainer } from '@jc/ui-components';

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
const borderConfig = {
  topLeft: { type: 'clip', size: 'md' },
  top: { type: 'clip', size: 'lg' },
  topRight: { type: 'round', size: 'lg' },
  right: { type: 'clip', size: 'lg' },
  bottomRight: { type: 'scoop', size: 'md' },
  bottom: { type: 'rect', size: 'lg' },
  bottomLeft: { type: 'rect', size: 'sm' },
  left: { type: 'clip', size: 'lg' },
};

const shapeConfig = {
  bevelConfig: {
    topLeft: { bevelSize: 30, bevelAngle: 45 },
    topRight: { bevelSize: 8, bevelAngle: 45 },
    bottomRight: { bevelSize: 30, bevelAngle: 45 },
    bottomLeft: { bevelSize: 10, bevelAngle: 45 },
  },
  stepsConfig: {
    top: {
      segments: [
        {
          start: 0.5,
          end: 1,
          height: 30,
        },
      ],
    },
  },
};
const DemoContainer = () => (
  <>
    <FlexWrapper>
      {new Array(2).fill(null).map((_, index) => {
        return (
          <BaseBeveledContainer
            key={index}
            shapeConfig={index % 2 === 0 ? shapeConfig : borderConfig}
            shadowConfig={{
              target: { type: 'mouse' },
              maxShadowDistance: 30,
              smoothing: 0,
            }}
            stroke="#00ffff"
            strokeWidth={'3'}
          >
            <Content />
          </BaseBeveledContainer>
        );
      })}
    </FlexWrapper>

    <FlexWrapper>
      {new Array(2).fill(null).map((_, index) => (
        <Content key={index} />
      ))}
    </FlexWrapper>
  </>
);

export default function Index() {
  /*

   */
  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignContent: 'center',
        }}
      >
        <ThemeSwitcher variant="dropdown" showLabel />
      </div>
      <DemoContainer />

      <Button variant="contained" size="large" color="primary">
        Click me
      </Button>
    </div>
  );
}
