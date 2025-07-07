import { ReactNode } from 'react';
import { ThemeControls } from '@jc/theming';
import { BaseBeveledContainer, Button } from '@jc/ui-components';

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

export default function Index() {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.none file.
   */
  return (
    <div>
      <div>
        {/* <ThemeSwitcher variant="dropdown" showLabel /> */}
        <ThemeControls
          layout="vertical"
          variantSelector="dropdown"
          showLabels
        />
      </div>

      <FlexWrapper>
        <Button variant="outlined" color="primary" size="large">
          Click me
        </Button>
      </FlexWrapper>
      {/* <DemoContainer /> */}
    </div>
  );
}
