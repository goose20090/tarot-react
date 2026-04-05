import { createFileRoute, notFound } from '@tanstack/react-router'
import { CardThumb } from '#/components/CardThumb'
import { PageHeader } from '#/components/PageHeader'
import { getPlanet } from '#/lib/tarot.functions'
import { parsePositiveInt } from '#/lib/tarot'

export const Route = createFileRoute('/planets/$planetId')({
  loader: async ({ params }) => {
    const planetId = parsePositiveInt(params.planetId)
    const data = await getPlanet({ data: { planetId } })
    if (!data) {
      throw notFound()
    }

    return data
  },
  component: PlanetDetailPage,
})

function PlanetDetailPage() {
  const { planet, cards } = Route.useLoaderData()

  return (
    <div className="space-y-8">
      <PageHeader
        backHref="/planets"
        backLabel="Planets"
        title={`${planet?.symbol} ${planet?.name}`}
      />

      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {cards.map((card) => (
          <CardThumb key={card.id} card={card} />
        ))}
      </div>
    </div>
  )
}
