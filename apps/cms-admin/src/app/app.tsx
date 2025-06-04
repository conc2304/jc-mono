// import { ConnectFour } from '@jc/games-lib';
import {
  BaseBeveledContainer,
  BeveledButton,
  BeveledCard,
  BeveledPanel,
} from '@jc/ui-components';

export function App() {
  return (
    <div
      style={{
        position: 'relative',
        height: '100vh',
        width: '100vw',
        background:
          'linear-gradient(-45deg,rgba(42, 123, 155, 1) 0%, rgba(87, 199, 133, 1) 50%, rgba(237, 221, 83, 1) 100%)',
      }}
    >
      {/* <ConnectFour /> */}
      {/* <BevelDemo /> */}

      <div style={{ width: 'auto', height: '100px', padding: '15px' }}>
        <BaseBeveledContainer
          background="url('https://t3.ftcdn.net/jpg/05/27/60/34/240_F_527603481_VUTQYCyYq0jPteCp7tQGueUQpfZp8tjQ.jpg') no-repeat center / cover"
          bevelConfig={{
            tl: { bevelSize: 20, bevelAngle: 45 },
            tr: { bevelSize: 15, bevelAngle: 45 },
            br: { bevelSize: 25, bevelAngle: 45 },
            bl: { bevelSize: 10, bevelAngle: 45 },
          }}
          fill="yellow"
          stroke="red"
          strokeWidth={2}
          glow={{
            color: 'green',
            intensity: 3,
            spread: 20,
            opacity: 1,
          }}
        />
      </div>

      {/* With gradient and glow */}
      <div style={{ width: '500px', height: '200px', padding: '15px' }}>
        <BaseBeveledContainer
          bevelConfig={{
            tl: { bevelSize: 30, bevelAngle: 45 },
            tr: { bevelSize: 30, bevelAngle: 45 },
            br: { bevelSize: 30, bevelAngle: 45 },
            bl: { bevelSize: 30, bevelAngle: 45 },
          }}
          background="linear-gradient(45deg, #ff6b6bdd, #4ecdc4dd)"
          stroke="#00ffff"
          strokeWidth={3}
          glow={{
            color: 'black',
            intensity: 4,
            spread: 0,
          }}
        />
      </div>

      <div style={{ width: '200px', height: '60px' }}>
        <BaseBeveledContainer
          background="linear-gradient(45deg, #667eea, #764ba2)"
          stroke="#ffffff"
          strokeWidth={2}
          bevelConfig={{
            tl: { bevelSize: 15, bevelAngle: 45 },
            tr: { bevelSize: 15, bevelAngle: 45 },
            br: { bevelSize: 15, bevelAngle: 45 },
            bl: { bevelSize: 15, bevelAngle: 45 },
          }}
          onClick={() => alert('Button clicked!')}
          glow={{
            color: '#667eea',
            intensity: 3,
            spread: 1,
          }}
        >
          <span style={{ color: 'white', fontWeight: 'bold' }}>Click Me!</span>
        </BaseBeveledContainer>
      </div>

      <BeveledButton
        variant="primary"
        size="large"
        onClick={() => console.log('handleButton')}
      >
        Submit Form
      </BeveledButton>

      {/* <BeveledPanel
        variant="modal"
        title="Confirm Action"
        onClose={() => console.log('handleClose')}
      >
        <p>Are you sure you want to delete this item?</p>
        <div>
          <BeveledButton variant="danger">Delete</BeveledButton>
          <BeveledButton variant="secondary">Cancel</BeveledButton>
        </div>
      </BeveledPanel> */}

      <BeveledCard
        title="Product Name"
        description="Product description"
        image="https://example.com/image.jpg"
        onClick={() => console.log('on Card Click')}
      >
        <p>Body of the Card</p>
      </BeveledCard>
    </div>
  );
}

export default App;
