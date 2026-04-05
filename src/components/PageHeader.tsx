import { Link } from '@tanstack/react-router'

type PageHeaderProps = {
  eyebrow?: string
  title: string
  subtitle?: React.ReactNode
  backHref?: string
  backLabel?: string
  actions?: React.ReactNode
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  backHref,
  backLabel,
  actions,
}: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="space-y-3">
        {backHref && backLabel ? (
          <Link
            to={backHref}
            className="focus-ring inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-3 py-1.5 text-sm text-[var(--text-soft)] transition hover:border-[var(--line-strong)] hover:text-[var(--text)]"
          >
            ← {backLabel}
          </Link>
        ) : null}
        {eyebrow ? <p className="kicker m-0">{eyebrow}</p> : null}
        <div className="space-y-2">
          <h1 className="display-font m-0 text-4xl leading-none tracking-tight text-[var(--accent-strong)]">
            {title}
          </h1>
          {subtitle ? (
            <div className="max-w-3xl text-base text-[var(--text-soft)]">{subtitle}</div>
          ) : null}
        </div>
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </div>
  )
}
