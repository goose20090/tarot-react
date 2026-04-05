import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { CardLightbox } from '#/components/CardLightbox'
import { MetaTable } from '#/components/MetaTable'
import { PageHeader } from '#/components/PageHeader'
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
    <div className="space-y-8">
      <PageHeader backHref="/cards" backLabel="Cards" title={card.name} subtitle={card.typeLabel} />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1fr)]">
        <section className="surface-panel-strong rounded-[2rem] p-4 md:p-6">
          <CardLightbox imageUrl={card.imageUrl} cardName={card.name} />
        </section>

        <section className="surface-panel-strong ornate-border rounded-[2rem] p-5 md:p-7">
          <MetaTable items={metaItems} />

          {card.alchemicalWedding ? (
            <div className="mt-8 rounded-[1.7rem] border border-[var(--line)] bg-[var(--panel-muted)] p-5">
              <p className="kicker m-0">Alchemical Wedding</p>
              <h2 className="display-font m-0 pt-2 text-3xl text-[var(--text)]">
                {titleize(card.alchemicalWedding)}
              </h2>
              <p className="m-0 pt-3 text-sm leading-7 text-[var(--text-soft)]">
                {card.alchemicalWedding === 'solve'
                  ? 'The opposites are presented here: Sulphur and Salt appear before the union is complete.'
                  : 'The union is complete here: Sulphur and Salt are reconciled into Philosophical Mercury.'}
              </p>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  )
}
