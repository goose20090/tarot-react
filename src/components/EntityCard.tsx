import { Link } from '@tanstack/react-router'

type EntityCardProps = {
  to: string
  params?: Record<string, string>
  search?: Record<string, unknown>
  icon: React.ReactNode
  title: React.ReactNode
  subtitle?: React.ReactNode
  meta?: React.ReactNode
}

export function EntityCard({
  to,
  params,
  search,
  icon,
  title,
  subtitle,
  meta,
}: EntityCardProps) {
  return (
    <Link
      to={to}
      params={params}
      search={search}
      className="surface-panel-strong focus-ring block rounded-2xl p-4 transition hover:border-[var(--accent)] hover:bg-[var(--panel-muted)]"
    >
      <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-3">
        <div className="display-font flex h-11 w-11 items-center justify-center rounded-lg border border-[var(--line)] bg-[var(--panel-muted)] text-xl text-[var(--accent-strong)]">
          {icon}
        </div>
        <div className="min-w-0">
          <h3 className="display-font m-0 text-2xl leading-none text-[var(--text)]">
            {title}
          </h3>
          {subtitle ? (
            <div className="pt-1.5 text-sm leading-6 text-[var(--text-soft)]">{subtitle}</div>
          ) : null}
          {meta ? (
            <div className="pt-2 text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
              {meta}
            </div>
          ) : null}
        </div>
      </div>
    </Link>
  )
}
