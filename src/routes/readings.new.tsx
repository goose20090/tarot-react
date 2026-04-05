import { createFileRoute, notFound } from '@tanstack/react-router'
import { EntityCard } from '#/components/EntityCard'
import { PageHeader } from '#/components/PageHeader'
import { ReadingBuilder } from '#/components/ReadingBuilder'
import { getReadingBuilder } from '#/lib/tarot.functions'

type ReadingBuilderSearch = {
  spreadId?: number
}

export const Route = createFileRoute('/readings/new')({
  validateSearch: (search: Record<string, unknown>): ReadingBuilderSearch => ({
    spreadId: typeof search.spreadId === 'string' ? Number(search.spreadId) : undefined,
  }),
  loader: async ({ search }) => {
    const data = await getReadingBuilder({ data: search })
    if (!data) {
      throw notFound()
    }

    return data
  },
  component: ReadingBuilderPage,
})

function ReadingBuilderPage() {
  const data = Route.useLoaderData()

  if (data.mode === 'choose') {
    return (
      <div className="space-y-8">
        <PageHeader
          eyebrow="Start a Reading"
          title="Choose a Spread"
          subtitle="Begin with a simple draw or move into a full Celtic Cross. The new builder keeps room for richer animation and interaction."
          backHref="/readings"
          backLabel="Readings"
        />

        <div className="grid gap-4 lg:grid-cols-2">
          {data.spreads.map((spread) => (
            <EntityCard
              key={spread.id}
              to="/readings/new"
              search={{ spreadId: spread.id }}
              icon={<span>{spread.positions.length}</span>}
              title={spread.name}
              subtitle={spread.description}
              meta={`${spread.positions.length} positions`}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <ReadingBuilder
      spread={data.spread}
      cards={data.allCards}
      significatorCard={data.significatorCard}
    />
  )
}
