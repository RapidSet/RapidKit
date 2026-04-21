import Link from 'next/link';
import { useRouter } from 'next/router';
import { SiteHeaderExtras } from './SiteHeaderExtras';
import { SITE_NAV_ITEMS } from './siteNavigation';

const normalizeNavItems = (items) => {
  return (items ?? [])
    .filter((item) => item && item.display !== 'hidden' && item.type !== 'menu')
    .map((item) => {
      let href = item.href || item.route || '#';

      if (item.children) {
        href = (item.withIndexPage ? item.route : item.firstChildRoute) || href;
      }

      return {
        href,
        title: item.title,
      };
    })
    .filter((item) => item.href && item.title);
};

const normalizePath = (path) => {
  if (!path) {
    return '/';
  }

  const pathname = path.split('?')[0].split('#')[0] || '/';

  if (pathname === '/') {
    return pathname;
  }

  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
};

export function SiteHeader({ items = [] }) {
  const router = useRouter();
  const currentPath = normalizePath(router.asPath ?? router.pathname);
  const navItems = normalizeNavItems(items.length > 0 ? items : SITE_NAV_ITEMS);

  return (
    <header className="rk-topbar rk-site-header" aria-label="Site navigation">
      <Link className="rk-logo" href="/">
        <span className="rk-logo-name">RapidKit</span>
      </Link>
      <nav className="rk-topnav">
        {navItems.map((item) => {
          const itemPath = normalizePath(item.href);
          const isActive =
            currentPath === itemPath || currentPath.startsWith(`${itemPath}/`);

          return (
            <Link
              key={item.href}
              className={`rk-topnav-link${isActive ? ' is-active' : ''}`}
              href={item.href}
            >
              {item.title}
            </Link>
          );
        })}
      </nav>
      <div className="rk-topbar-tools">
        <SiteHeaderExtras />
      </div>
    </header>
  );
}
