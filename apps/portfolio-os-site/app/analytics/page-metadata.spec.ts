import { describe, expect, it } from 'vitest';

import {
  buildPageMetadata,
  humanizeSlug,
  normalizePath,
  sanitizeSearch,
} from './page-metadata';

const origin = 'https://www.clyzby.com';

const build = (pathname: string, search = '', routeId?: string) =>
  buildPageMetadata({ pathname, search, origin, routeId });

describe('buildPageMetadata', () => {
  it('maps the boot screen', () => {
    expect(build('/', '', 'app')).toEqual({
      page_path: '/',
      page_location: 'https://www.clyzby.com/',
      page_title: 'Welcome | Jose Conchello',
      content_group: 'boot',
    });
  });

  it('maps the empty desktop, ignoring a trailing slash', () => {
    expect(build('/home/', '', 'routes/home')).toMatchObject({
      page_path: '/home',
      page_location: 'https://www.clyzby.com/home',
      page_title: 'Desktop | Jose Conchello',
      content_group: 'desktop',
    });
  });

  it('titles a window by its last slug and groups by its top-level folder', () => {
    expect(build('/home/projects/my-cool-project', '', 'routes/home')).toEqual({
      page_path: '/home/projects/my-cool-project',
      page_location: 'https://www.clyzby.com/home/projects/my-cool-project',
      page_title: 'My Cool Project | Jose Conchello',
      content_group: 'projects',
    });
  });

  it('maps the LED controller page', () => {
    expect(build('/led-controller', '', 'routes/led-controller')).toMatchObject(
      { page_title: 'LED Controller | Jose Conchello', content_group: 'led-controller' }
    );
  });

  it('maps the 404 route by route id', () => {
    expect(build('/nope', '', 'routes/404')).toMatchObject({
      page_path: '/nope',
      page_title: 'Page Not Found | Jose Conchello',
      content_group: 'not-found',
    });
  });

  it('keeps campaign params and drops everything else from page_location', () => {
    expect(
      build('/', '?utm_source=x&email=a%40b.c&ga_debug=1', 'app').page_location
    ).toBe('https://www.clyzby.com/?utm_source=x');
  });
});

describe('sanitizeSearch', () => {
  it('returns an empty string when nothing is allowed', () => {
    expect(sanitizeSearch('?q=secret')).toBe('');
    expect(sanitizeSearch('')).toBe('');
  });

  it('keeps allowlisted params in order', () => {
    expect(sanitizeSearch('?gclid=1&x=2&utm_medium=email')).toBe(
      '?gclid=1&utm_medium=email'
    );
  });
});

describe('humanizeSlug', () => {
  it('title-cases words split on dashes and underscores', () => {
    expect(humanizeSlug('led_wall-controller')).toBe('Led Wall Controller');
  });

  it('decodes encoded segments and tolerates malformed encoding', () => {
    expect(humanizeSlug('caf%C3%A9')).toBe('Café');
    expect(humanizeSlug('bad%E0')).toBe('Bad%E0');
  });
});

describe('normalizePath', () => {
  it('keeps the root path', () => {
    expect(normalizePath('/')).toBe('/');
    expect(normalizePath('//')).toBe('/');
  });
});
