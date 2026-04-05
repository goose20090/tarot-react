import { Link } from '@tanstack/react-router'

type CardThumbProps = {
  card: {
    id: number
    name: string
    thumbUrl: string | null
    imageUrl: string | null
    badge: string
  }
  caption?: React.ReactNode
}

export function CardThumb({ card, caption }: CardThumbProps) {
  function prefetchImage() {
    if (!card.imageUrl) return
    if (document.querySelector(`link[rel="preload"][href="${card.imageUrl}"]`)) return
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = card.imageUrl
    document.head.appendChild(link)
  }

  return (
    <Link
      to="/cards/$cardId"
      params={{ cardId: String(card.id) }}
      preload="intent"
      onMouseEnter={prefetchImage}
      className="focus-ring surface-panel-strong block overflow-hidden rounded-2xl transition hover:-translate-y-1 hover:border-[var(--accent)] hover:shadow-[0_8px_24px_rgba(201,168,76,0.2)]"
    >
      <div className="bg-[var(--panel-muted)]">
        {card.thumbUrl ? (
          <img
            src={card.thumbUrl}
            alt={card.name}
            loading="lazy"
            className="aspect-[9/15] w-full object-cover object-top"
          />
        ) : (
          <div className="display-font flex aspect-[0.72] items-center justify-center p-4 text-center text-base text-[var(--text-soft)]">
            {card.name}
          </div>
        )}
      </div>
      <div className="px-3 pt-2.5 pb-3">
        <p className="m-0 text-xs uppercase tracking-wide text-[var(--text-muted)]">{card.badge}</p>
        <h3 className="display-font m-0 pt-0.5 text-sm leading-tight text-[var(--text)]">
          {card.name}
        </h3>
        {caption ? <div className="pt-1 text-xs text-[var(--text-soft)]">{caption}</div> : null}
      </div>
    </Link>
  )
}
