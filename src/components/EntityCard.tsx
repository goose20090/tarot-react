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
      className="surface-panel-strong focus-ring block rounded-[1.7rem] p-4 transition hover:-translate-y-1 hover:border-[var(--line-strong)]"
    >
      <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-4">
        <div className="display-font flex h-14 w-14 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--panel-muted)] text-2xl text-[var(--text)]">
          {icon}
        </div>
        <div className="min-w-0">
          <h3 className="display-font m-0 text-3xl leading-none text-[var(--text)]">
            {title}
          </h3>
          {subtitle ? (
            <div className="pt-2 text-sm leading-6 text-[var(--text-soft)]">{subtitle}</div>
          ) : null}
          {meta ? (
            <div className="pt-3 text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
              {meta}
            </div>
          ) : null}
        </div>
      </div>
    </Link>
  )
}
