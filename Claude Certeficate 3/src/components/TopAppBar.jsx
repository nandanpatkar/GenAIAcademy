import Icon from './Icon.jsx';

/*
 * Persistent app bar. The breadcrumb trail is the "navigate back at every
 * level" affordance: every ancestor crumb is a real button, the current level
 * is plain text marked aria-current.
 */

export default function TopAppBar({ crumbs = [], onHome, brandIcon = 'school', brandLabel = 'Claude Certifications' }) {
  return (
    <header className="appbar">
      <button type="button" className="appbar__brand" onClick={onHome}>
        <Icon name={brandIcon} />
        <span>{brandLabel}</span>
      </button>

      {crumbs.length > 0 ? (
        <nav className="appbar__crumbs" aria-label="Breadcrumb">
          {crumbs.map((crumb, index) => {
            const isLast = index === crumbs.length - 1;
            return (
              <span key={`${crumb.label}-${index}`} className="appbar__crumbs">
                <Icon name="chevronRight" className="appbar__sep" />
                {isLast || !crumb.onClick ? (
                  <span className="appbar__crumb appbar__crumb--current" aria-current="page">
                    {crumb.label}
                  </span>
                ) : (
                  <button type="button" className="appbar__crumb" onClick={crumb.onClick}>
                    {crumb.label}
                  </button>
                )}
              </span>
            );
          })}
        </nav>
      ) : null}

      <span className="appbar__spacer" />
    </header>
  );
}
