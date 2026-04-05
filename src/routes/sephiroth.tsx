import { Outlet, createFileRoute, useRouterState } from '@tanstack/react-router'
import { EntityCard } from '#/components/EntityCard'
import { PageHeader } from '#/components/PageHeader'
import { getSephiroth } from '#/lib/tarot.functions'

export const Route = createFileRoute('/sephiroth')({
  loader: () => getSephiroth(),
  component: SephirothRouteComponent,
})

function SephirothRouteComponent() {
  const isIndex = useRouterState({
    select: (state) => state.location.pathname === '/sephiroth',
  })

  if (!isIndex) {
    return <Outlet />
  }

  return <SephirothIndexPage />
}

function SephirothIndexPage() {
  const { sephiroth } = Route.useLoaderData()

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Reference"
        title="Sephiroth"
        subtitle="The ten spheres of the Tree of Life and the cards that rest within them."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {sephiroth.map((node) => (
          <EntityCard
            key={node.id}
            to="/sephiroth/$sephiraId"
            params={{ sephiraId: String(node.id) }}
            icon={<span>{node.number}</span>}
            title={node.name}
            subtitle={node.meaning}
            meta={`${node.cardCount} cards`}
          />
        ))}
      </div>
    </div>
  )
}
