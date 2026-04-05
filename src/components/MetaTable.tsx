type MetaItem = {
  label: string
  value: React.ReactNode
}

export function MetaTable({ items }: { items: MetaItem[] }) {
  return (
    <dl className="grid gap-4 md:grid-cols-[160px_minmax(0,1fr)]">
      {items.map((item) => (
        <div key={item.label} className="contents">
          <dt className="text-sm uppercase tracking-[0.18em] text-[var(--text-muted)]">
            {item.label}
          </dt>
          <dd className="m-0 text-[var(--text-soft)]">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}
