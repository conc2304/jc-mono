import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';

import {
  createPageViewTracker,
  NavigationAction,
  PageViewPayload,
  PageViewTracker,
  UI_ONLY_NAVIGATION_STATE,
} from './page-view-tracker';

const origin = 'https://www.clyzby.com';

describe('createPageViewTracker', () => {
  let pageView: Mock<(payload: PageViewPayload) => void>;
  let tracker: PageViewTracker;
  let keyCounter: number;

  const navigate = (
    pathname: string,
    action: NavigationAction = 'PUSH',
    state: unknown = null,
    key = `k${++keyCounter}`
  ) =>
    tracker.onNavigation({ key, pathname, search: '', state, action, origin });

  const paths = () => pageView.mock.calls.map(([payload]) => payload.page_path);

  beforeEach(() => {
    pageView = vi.fn();
    tracker = createPageViewTracker({ pageView });
    keyCounter = 0;
    navigate('/', 'POP', null, 'default');
  });

  it('sends one view on initial load without a referrer', () => {
    expect(pageView).toHaveBeenCalledTimes(1);
    expect(pageView.mock.calls[0][0].page_referrer).toBeUndefined();
  });

  it('ignores the same navigation processed twice (StrictMode)', () => {
    navigate('/', 'POP', null, 'default');
    navigate('/home', 'PUSH', null, 'k-home');
    navigate('/home', 'PUSH', null, 'k-home');
    expect(paths()).toEqual(['/', '/home']);
  });

  it('sets page_referrer to the previous committed location', () => {
    navigate('/home');
    expect(pageView.mock.calls[1][0].page_referrer).toBe(`${origin}/`);
  });

  it('ignores a new history entry for the current path (re-focus, double push)', () => {
    navigate('/home');
    navigate('/home');
    navigate('/home/projects/a');
    navigate('/home/projects/a');
    expect(paths()).toEqual(['/', '/home', '/home/projects/a']);
  });

  it('counts a nested open as one view per URL change', () => {
    navigate('/home');
    navigate('/home/projects');
    navigate('/home/projects/a');
    expect(paths()).toEqual(['/', '/home', '/home/projects', '/home/projects/a']);
  });

  it('counts project next/previous replace navigations', () => {
    navigate('/home/projects/a');
    navigate('/home/projects/b', 'REPLACE');
    expect(paths()).toEqual(['/', '/home/projects/a', '/home/projects/b']);
  });

  it('skips UI-only window-close navigations', () => {
    navigate('/home/projects/a');
    navigate('/home/projects/b');
    navigate('/home/projects/a', 'REPLACE', UI_ONLY_NAVIGATION_STATE);
    navigate('/home', 'REPLACE', UI_ONLY_NAVIGATION_STATE);
    expect(paths()).toEqual(['/', '/home/projects/a', '/home/projects/b']);
  });

  it('counts reopening a window after closing it', () => {
    navigate('/home/x');
    navigate('/home', 'REPLACE', UI_ONLY_NAVIGATION_STATE);
    navigate('/home/x');
    expect(paths()).toEqual(['/', '/home/x', '/home/x']);
  });

  it('honours Back/Forward even onto an entry carrying the skip marker', () => {
    navigate('/home/x');
    navigate('/home', 'REPLACE', UI_ONLY_NAVIGATION_STATE);
    navigate('/home/y');
    navigate('/home', 'POP', UI_ONLY_NAVIGATION_STATE);
    navigate('/home/y', 'POP');
    expect(paths()).toEqual(['/', '/home/x', '/home/y', '/home', '/home/y']);
  });

  it('ignores Back between duplicate entries for the same path', () => {
    navigate('/home');
    navigate('/home');
    navigate('/home', 'POP');
    expect(paths()).toEqual(['/', '/home']);
  });

  it('counts intentional revisits of a previously viewed route', () => {
    navigate('/home/a');
    navigate('/home/b');
    navigate('/home/a');
    expect(paths()).toEqual(['/', '/home/a', '/home/b', '/home/a']);
  });

  it('counts a reload whose restored history state carries the skip marker', () => {
    const reloaded = createPageViewTracker({ pageView });
    pageView.mockClear();
    reloaded.onNavigation({
      key: 'default',
      pathname: '/home',
      search: '',
      state: UI_ONLY_NAVIGATION_STATE,
      action: 'POP',
      origin,
    });
    expect(pageView).toHaveBeenCalledTimes(1);
  });
});
