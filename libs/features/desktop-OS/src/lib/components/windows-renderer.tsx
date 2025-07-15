import { useWindowManager, useWindowState, Window } from '@jc/ui-components';

export const WindowsRenderer = () => {
  const { windows } = useWindowState();
  return (
    <>
      {windows &&
        windows.map((windowMetaData) => (
          <Window
            {...windowMetaData}
            minWidth={300}
            minHeight={200}
            resizable
            key={windowMetaData.id}
          />
        ))}
    </>
  );
};
