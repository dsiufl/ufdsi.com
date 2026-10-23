import type { ReactNode } from "react";

export function PageHeader({
  label,
  title,
  description,
  actions,
}: {
  label?: string;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <header className="admin-head">
      <div className="admin-head__text">
        {label && <p className="admin-label">{label}</p>}
        <h1 className="admin-title">{title}</h1>
        {description && <p className="admin-lede">{description}</p>}
      </div>
      {actions && <div className="admin-head__actions">{actions}</div>}
    </header>
  );
}

export function Panel({
  icon,
  title,
  meta,
  actions,
  children,
  className = "",
}: {
  icon?: ReactNode;
  title?: ReactNode;
  meta?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`admin-panel ${className}`}>
      {(title || actions) && (
        <div className="admin-panel__head">
          <div className="flex min-w-0 items-baseline gap-2">
            {title && <h2 className="admin-panel__title">{icon}{title}</h2>}
            {meta && <span className="admin-panel__meta">{meta}</span>}
          </div>
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

export function Empty({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="admin-empty">
      <strong>{title}</strong>
      {children && <span>{children}</span>}
    </div>
  );
}
