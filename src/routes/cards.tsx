import * as Tabs from '@radix-ui/react-tabs'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { CardThumb } from '#/components/CardThumb'
import { PageHeader } from '#/components/PageHeader'
import { getCards } from '#/lib/tarot.functions'

type CardsSearch = {
  arcana?: 'major' | 'minor'
  suit?: 'wands' | 'cups' | 'swords' | 'disks'
}

export const Route = createFileRoute('/cards')({
  validateSearch: (search: Record<string, unknown>): CardsSearch => ({
    arcana: search.arcana === 'major' || search.arcana === 'minor' ? search.arcana : undefined,
    suit:
      search.suit === 'wands' ||
      search.suit === 'cups' ||
      search.suit === 'swords' ||
      search.suit === 'disks'
        ? search.suit
        : undefined,
  }),
  loader: ({ search }) => getCards({ data: search }),
  component: CardsPage,
})

const tabSearch: Record<string, CardsSearch> = {
  all: {},
  major: { arcana: 'major' },
  wands: { arcana: 'minor', suit: 'wands' },
  cups: { arcana: 'minor', suit: 'cups' },
  swords: { arcana: 'minor', suit: 'swords' },
  disks: { arcana: 'minor', suit: 'disks' },
}

function CardsPage() {
  const navigate = useNavigate()
  const search = Route.useSearch()
  const data = Route.useLoaderData()

  const activeTab = search.suit ?? (search.arcana === 'major' ? 'major' : 'all')

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Study the Deck"
        title="Cards"
        subtitle="Browse the full Thoth deck by arcana or suit. Each card page carries the same correspondence structure as the original Rails app, rebuilt for a more interactive front end."
      />

      <section className="surface-panel rounded-[1.8rem] p-4">
        <Tabs.Root
          value={activeTab}
          onValueChange={(value) =>
            navigate({
              to: '/cards',
              search: tabSearch[value] ?? {},
            })
          }
        >
          <Tabs.List className="flex flex-wrap gap-2">
            {[
              ['all', 'All'],
              ['major', '✨ Atu'],
              ['wands', '🔥 Wands'],
              ['cups', '🌊 Cups'],
              ['swords', '⚔️ Swords'],
              ['disks', '🪙 Disks'],
            ].map(([value, label]) => (
              <Tabs.Trigger
                key={value}
                value={value}
                className="focus-ring rounded-full border border-[var(--line)] px-4 py-2 text-sm text-[var(--text-soft)] transition data-[state=active]:border-[var(--line-strong)] data-[state=active]:bg-[var(--panel-muted)] data-[state=active]:text-[var(--text)]"
              >
                {label}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
        </Tabs.Root>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data.cards.map((card, index) => (
          <div key={card.id} className="rise-in" style={{ animationDelay: `${index * 24}ms` }}>
            <CardThumb card={card} />
          </div>
        ))}
      </div>
    </div>
  )
}
