const SITE_NAME = 'Jose Conchello';
const NOT_FOUND_ROUTE_ID = 'routes/404';
const HOME_PATH = '/home';

// Only campaign attribution params are exported; everything else in the
// query string (and the hash) is dropped so arbitrary URL input never reaches GA.
const ALLOWED_QUERY_PARAMS = new Set([
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'utm_id',
  'gclid',
  'gbraid',
  'wbraid',
]);

export type PageMetadata = {
  page_path: string;
  page_location: string;
  page_title: string;
  content_group: string;
};

export type PageLocationInput = {
  pathname: string;
  search: string;
  origin: string;
  routeId?: string;
};

export function normalizePath(pathname: string): string {
  const trimmed = pathname.replace(/\/+$/, '');
  return trimmed || '/';
}

export function sanitizeSearch(search: string): string {
  const kept = new URLSearchParams();
  new URLSearchParams(search).forEach((value, key) => {
    if (ALLOWED_QUERY_PARAMS.has(key)) kept.append(key, value);
  });
  const query = kept.toString();
  return query ? `?${query}` : '';
}

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function humanizeSlug(slug: string): string {
  return safeDecode(slug)
    .split(/[-_]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function describePage(
  path: string,
  routeId?: string
): { title: string; group: string } {
  if (routeId === NOT_FOUND_ROUTE_ID) {
    return { title: 'Page Not Found', group: 'not-found' };
  }
  if (path === '/') return { title: 'Welcome', group: 'boot' };
  if (path === '/led-controller') {
    return { title: 'LED Controller', group: 'led-controller' };
  }
  if (path === HOME_PATH) return { title: 'Desktop', group: 'desktop' };

  if (path.startsWith(`${HOME_PATH}/`)) {
    const slugs = path.slice(HOME_PATH.length + 1).split('/').filter(Boolean);
    return {
      title: humanizeSlug(slugs[slugs.length - 1]),
      group: safeDecode(slugs[0]).toLowerCase(),
    };
  }

  return { title: 'Page Not Found', group: 'not-found' };
}

// Pure: derives analytics identity from the committed URL only, so it never
// waits on window state or rendering.
export function buildPageMetadata({
  pathname,
  search,
  origin,
  routeId,
}: PageLocationInput): PageMetadata {
  const pagePath = normalizePath(pathname);
  const { title, group } = describePage(pagePath, routeId);

  return {
    page_path: pagePath,
    page_location: `${origin}${pagePath}${sanitizeSearch(search)}`,
    page_title: `${title} | ${SITE_NAME}`,
    content_group: group,
  };
}
