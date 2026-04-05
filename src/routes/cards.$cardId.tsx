import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { CardLightbox } from '#/components/CardLightbox'
import { MetaTable } from '#/components/MetaTable'
import { getCard } from '#/lib/tarot.functions'
import { parsePositiveInt, titleize } from '#/lib/tarot'

export const Route = createFileRoute('/cards/$cardId')({
  loader: async ({ params }) => {
    const cardId = parsePositiveInt(params.cardId)
    const data = await getCard({ data: { cardId } })
    if (!data) {
      throw notFound()
    }

    return data
  },
  component: CardDetailPage,
})

function CardDetailPage() {
  const { card } = Route.useLoaderData()
  const metaItems =
    card.arcana === 'major'
      ? [
          { label: 'ATU', value: card.atuNumber },
          card.path
            ? {
                label: 'Path',
                value: (
                  <Link to="/paths/$pathId" params={{ pathId: String(card.path.id) }}>
                    Path {card.path.number}
                  </Link>
                ),
              }
            : null,
          card.path?.startSephira
            ? {
                label: 'Connects',
                value: (
                  <div className="flex flex-col gap-1">
                    <Link
                      to="/sephiroth/$sephiraId"
                      params={{ sephiraId: String(card.path.startSephira.id) }}
                    >
                      {card.path.startSephira.number}. {card.path.startSephira.name}
                    </Link>
                    {card.path.endSephira ? (
                      <Link
                        to="/sephiroth/$sephiraId"
                        params={{ sephiraId: String(card.path.endSephira.id) }}
                      >
                        {card.path.endSephira.number}. {card.path.endSephira.name}
                      </Link>
                    ) : null}
                  </div>
                ),
              }
            : null,
          card.path?.hebrewLetter
            ? {
                label: 'Hebrew Letter',
                value: (
                  <Link
                    to="/hebrew-letters/$letterId"
                    params={{ letterId: String(card.path.hebrewLetter.id) }}
                  >
                    {card.path.hebrewLetter.letter} {card.path.hebrewLetter.name} ·{' '}
                    {card.path.hebrewLetter.meaning}
                  </Link>
                ),
              }
            : null,
          card.zodiacSign
            ? {
                label: 'Zodiac',
                value: (
                  <Link
                    to="/zodiac-signs/$signId"
                    params={{ signId: String(card.zodiacSign.id) }}
                  >
                    {card.zodiacSign.symbol} {card.zodiacSign.name}
                  </Link>
                ),
              }
            : null,
          card.planet
            ? {
                label: 'Planet',
                value: (
                  <Link
                    to="/planets/$planetId"
                    params={{ planetId: String(card.planet.id) }}
                  >
                    {card.planet.symbol} {card.planet.name}
                  </Link>
                ),
              }
            : null,
          card.element
            ? {
                label: 'Element',
                value: (
                  <Link
                    to="/elements/$elementId"
                    params={{ elementId: String(card.element.id) }}
                  >
                    {card.element.symbol} {card.element.name}
                  </Link>
                ),
              }
            : null,
          card.alchemicalPrinciple
            ? {
                label: 'Tria Prima',
                value: (
                  <Link
                    to="/alchemical-principles/$principleId"
                    params={{ principleId: String(card.alchemicalPrinciple.id) }}
                  >
                    {card.alchemicalPrinciple.symbol} {card.alchemicalPrinciple.name}
                  </Link>
                ),
              }
            : null,
        ].filter(Boolean)
      : [
          {
            label: 'Suit',
            value: `${card.badge.split(' ').slice(0, 2).join(' ')}`,
          },
          {
            label: 'Rank',
            value: titleize(card.rank),
          },
          card.sephira
            ? {
                label: 'Sephira',
                value: (
                  <div className="space-y-1">
                    <Link
                      to="/sephiroth/$sephiraId"
                      params={{ sephiraId: String(card.sephira.id) }}
                    >
                      {card.sephira.number}. {card.sephira.name}
                    </Link>
                    <div className="text-sm text-[var(--text-muted)]">
                      {card.sephira.meaning}
                    </div>
                  </div>
                ),
              }
            : null,
          card.zodiacSign
            ? {
                label: 'Zodiac',
                value: (
                  <Link
                    to="/zodiac-signs/$signId"
                    params={{ signId: String(card.zodiacSign.id) }}
                  >
                    {card.zodiacSign.symbol} {card.zodiacSign.name}
                  </Link>
                ),
              }
            : null,
          card.planet
            ? {
                label: 'Planet',
                value: (
                  <Link
                    to="/planets/$planetId"
                    params={{ planetId: String(card.planet.id) }}
                  >
                    {card.planet.symbol} {card.planet.name}
                  </Link>
                ),
              }
            : null,
          card.element
            ? {
                label: 'Element',
                value: (
                  <Link
                    to="/elements/$elementId"
                    params={{ elementId: String(card.element.id) }}
                  >
                    {card.element.symbol} {card.element.name}
                  </Link>
                ),
              }
            : null,
          card.alchemicalPrinciple
            ? {
                label: 'Tria Prima',
                value: (
                  <Link
                    to="/alchemical-principles/$principleId"
                    params={{ principleId: String(card.alchemicalPrinciple.id) }}
                  >
                    {card.alchemicalPrinciple.symbol} {card.alchemicalPrinciple.name}
                  </Link>
                ),
              }
            : null,
        ].filter(Boolean)

  return (
    <div className="space-y-7">
      <Link
        to="/cards"
        className="inline-block text-[0.9rem] text-[var(--text-muted)] transition hover:text-[var(--accent)]"
      >
        ← Cards
      </Link>

      <div className="grid gap-12 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start">
        <div className="overflow-hidden rounded-xl border border-[var(--line)] shadow-[0_4px_32px_rgba(0,0,0,0.5)]">
          <CardLightbox imageUrl={card.imageUrl} cardName={card.name} />
        </div>

        <div>
          <div className="mb-6">
            <h1 className="display-font m-0 text-[2rem] leading-[1.2] text-[var(--accent-strong)]">
              {card.name}
            </h1>
            <p className="m-0 mt-1.5 text-[0.8rem] uppercase tracking-[0.08em] text-[var(--text-muted)]">
              {card.typeLabel}
            </p>
          </div>

          <MetaTable items={metaItems} />

          {card.alchemicalWedding ? (
            <div className="mt-8 rounded-2xl border border-[var(--accent)] border-l-4 bg-[var(--panel-strong)] px-6 py-5">
              <p className="display-font m-0 mb-2.5 text-[0.85rem] uppercase tracking-[0.06em] text-[var(--accent-strong)]">
                Alchemical Wedding — {titleize(card.alchemicalWedding)}
              </p>
              <p className="m-0 mb-3 text-[0.9rem] leading-[1.6] text-[var(--text-muted)]">
                {card.alchemicalWedding === 'solve'
                  ? 'The opposites are presented here: Sulphur and Salt appear before the union is complete.'
                  : 'The union is complete here: Sulphur and Salt are reconciled into Philosophical Mercury.'}
              </p>
              <Link to="/alchemical-principles" className="text-sm">
                → Alchemical Principles
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
