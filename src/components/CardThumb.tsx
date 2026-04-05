import { Link } from '@tanstack/react-router'

type CardThumbProps = {
  card: {
    id: number
    name: string
    thumbUrl: string | null
    badge: string
  }
  caption?: React.ReactNode
}

export function CardThumb({ card, caption }: CardThumbProps) {
  return (
    <Link
      to="/cards/$cardId"
      params={{ cardId: String(card.id) }}
      className="group focus-ring surface-panel-strong block rounded-[1.75rem] p-3 transition hover:-translate-y-1 hover:border-[var(--line-strong)]"
    >
      <div className="overflow-hidden rounded-[1.2rem] border border-[var(--line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))]">
        {card.thumbUrl ? (
          <img
            src={card.thumbUrl}
            alt={card.name}
            loading="lazy"
            className="aspect-[0.72] w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="display-font flex aspect-[0.72] items-center justify-center bg-[var(--panel-muted)] p-6 text-center text-2xl text-[var(--text-soft)]">
            {card.name}
          </div>
        )}
      </div>
      <div className="pt-3">
        <p className="m-0 text-sm text-[var(--text-muted)]">{card.badge}</p>
        <h3 className="display-font m-0 pt-1 text-2xl leading-tight text-[var(--text)]">
          {card.name}
        </h3>
        {caption ? <div className="pt-2 text-sm text-[var(--text-soft)]">{caption}</div> : null}
      </div>
    </Link>
  )
}
