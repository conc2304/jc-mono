import { render } from '@testing-library/react';

import Boids from './boids';

describe('Boids', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Boids />);
    expect(baseElement).toBeTruthy();
  });
});
