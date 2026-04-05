type MetaItem = {
  label: string
  value: React.ReactNode
}

export function MetaTable({ items }: { items: MetaItem[] }) {
  return (
    <dl className="grid gap-x-5 gap-y-2" style={{ gridTemplateColumns: 'max-content 1fr' }}>
      {items.map((item) => (
        <div key={item.label} className="contents">
          <dt className="text-xs uppercase tracking-[0.06em] text-[var(--text-muted)] pt-0.5 whitespace-nowrap">
            {item.label}
          </dt>
          <dd className="m-0 text-[var(--text)]">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}
