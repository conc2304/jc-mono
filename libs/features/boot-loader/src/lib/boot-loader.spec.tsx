import { render } from '@testing-library/react';

import BootLoader from './boot-loader';

describe('BootLoader', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BootLoader />);
    expect(baseElement).toBeTruthy();
  });
});
