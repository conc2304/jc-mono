import { StrictMode } from 'react';
import { act, render } from '@testing-library/react';
import { createMemoryRouter, Outlet, RouterProvider } from 'react-router';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';

import {
  createPageViewTracker,
  PageViewPayload,
  PageViewTracker,
  UI_ONLY_NAVIGATION_STATE,
} from './page-view-tracker';
import { usePageViewTracking } from './use-page-view-tracking';

describe('usePageViewTracking', () => {
  let pageView: Mock<(payload: PageViewPayload) => void>;
  let tracker: PageViewTracker;

  const titles = () =>
    pageView.mock.calls.map(([payload]) => payload.page_title);

  function renderAt(initialEntry: string) {
    function Root() {
      usePageViewTracking(tracker);
      return <Outlet />;
    }

    const router = createMemoryRouter(
      [
        {
          id: 'root',
          path: '/',
          Component: Root,
          children: [
            { id: 'app', index: true, Component: () => null },
            { id: 'routes/home', path: 'home/*', Component: () => null },
            { id: 'routes/404', path: '*', Component: () => null },
          ],
        },
      ],
      { initialEntries: [initialEntry] }
    );

    render(
      <StrictMode>
        <RouterProvider router={router} />
      </StrictMode>
    );

    return router;
  }

  beforeEach(() => {
    pageView = vi.fn();
    tracker = createPageViewTracker({ pageView });
  });

  it('sends exactly one view on initial load under StrictMode', () => {
    renderAt('/');
    expect(titles()).toEqual(['Welcome | Jose Conchello']);
  });

  it('sends one view for a deep link', () => {
    renderAt('/home/projects/my-project');
    expect(pageView).toHaveBeenCalledTimes(1);
    expect(pageView.mock.calls[0][0]).toMatchObject({
      page_path: '/home/projects/my-project',
      page_title: 'My Project | Jose Conchello',
      content_group: 'projects',
    });
  });

  it('tracks the full window lifecycle', async () => {
    const router = renderAt('/');

    await act(() => router.navigate('/home'));
    await act(() => router.navigate('/home/projects/a'));
    await act(() => router.navigate('/home/projects/a'));
    await act(() =>
      router.navigate('/home/projects/b', { replace: true })
    );
    await act(() =>
      router.navigate('/home', {
        replace: true,
        state: UI_ONLY_NAVIGATION_STATE,
      })
    );
    await act(() => router.navigate('/home/projects/b'));
    await act(() => router.navigate(-1));
    await act(() => router.navigate(1));

    expect(pageView.mock.calls.map(([p]) => p.page_path)).toEqual([
      '/',
      '/home',
      '/home/projects/a',
      '/home/projects/b',
      '/home/projects/b',
      '/home',
      '/home/projects/b',
    ]);
  });

  it('uses the 404 route id for unknown routes', async () => {
    const router = renderAt('/');
    await act(() => router.navigate('/does-not-exist'));
    expect(titles()).toEqual([
      'Welcome | Jose Conchello',
      'Page Not Found | Jose Conchello',
    ]);
  });
});
