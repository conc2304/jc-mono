import { ReactNode } from 'react';
import { ThemeSwitcher } from '@jc/augmented-ui';

export default function DesignSystemLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          position: 'absolute',
          right: 5,
          top: 5,
        }}
      >
        <ThemeSwitcher />
      </div>
      {children}
    </div>
  );
}
