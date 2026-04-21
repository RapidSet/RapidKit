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
    <header className="mz-topbar mz-site-header" aria-label="Site navigation">
      <Link className="mz-logo" href="/">
        <span className="mz-logo-name">RapidKit</span>
      </Link>
      <nav className="mz-topnav">
        {navItems.map((item) => {
          const itemPath = normalizePath(item.href);
          const isActive =
            currentPath === itemPath || currentPath.startsWith(`${itemPath}/`);

          return (
            <Link
              key={item.href}
              className={`mz-topnav-link${isActive ? ' is-active' : ''}`}
              href={item.href}
            >
              {item.title}
            </Link>
          );
        })}
      </nav>
      <div className="mz-topbar-tools">
        <SiteHeaderExtras />
      </div>
    </header>
  );
}
