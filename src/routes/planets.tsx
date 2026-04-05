import { Outlet, createFileRoute, useRouterState } from '@tanstack/react-router'
import { EntityCard } from '#/components/EntityCard'
import { PageHeader } from '#/components/PageHeader'
import { getPlanets } from '#/lib/tarot.functions'

export const Route = createFileRoute('/planets')({
  loader: () => getPlanets(),
  component: PlanetsRouteComponent,
})

function PlanetsRouteComponent() {
  const isIndex = useRouterState({
    select: (state) => state.location.pathname === '/planets',
  })

  if (!isIndex) {
    return <Outlet />
  }

  return <PlanetsIndexPage />
}

function PlanetsIndexPage() {
  const { planets } = Route.useLoaderData()

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Reference"
        title="Planets"
        subtitle="Planetary correspondences across the deck."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {planets.map((planet) => (
          <EntityCard
            key={planet.id}
            to="/planets/$planetId"
            params={{ planetId: String(planet.id) }}
            icon={<span>{planet.symbol}</span>}
            title={planet.name}
            meta={`${planet.cardCount} cards`}
          />
        ))}
      </div>
    </div>
  )
}
