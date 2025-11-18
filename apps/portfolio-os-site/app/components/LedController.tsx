import { ColorPickerPage } from '@jc/led-controller';

const LedController = () => {
  // TODO handle api calls here
  const handleUpdate = (color: string) => {
    console.log('LED-Controller Update : ', color);
  };

  return <ColorPickerPage onUpdate={handleUpdate} />;
};

export default LedController;
