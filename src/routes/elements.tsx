import { Outlet, createFileRoute, useRouterState } from '@tanstack/react-router'
import { EntityCard } from '#/components/EntityCard'
import { PageHeader } from '#/components/PageHeader'
import { getElements } from '#/lib/tarot.functions'

export const Route = createFileRoute('/elements')({
  loader: () => getElements(),
  component: ElementsRouteComponent,
})

function ElementsRouteComponent() {
  const isIndex = useRouterState({
    select: (state) => state.location.pathname === '/elements',
  })

  if (!isIndex) {
    return <Outlet />
  }

  return <ElementsIndexPage />
}

function ElementsIndexPage() {
  const { elements } = Route.useLoaderData()

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Reference"
        title="Elements"
        subtitle="The four classical elements and their direct tarot correspondences."
      />

      <div className="flex flex-col gap-3">
        {elements.map((element) => (
          <EntityCard
            key={element.id}
            to="/elements/$elementId"
            params={{ elementId: String(element.id) }}
            icon={<span>{element.symbol}</span>}
            title={element.name}
            subtitle={element.zodiacSigns.join(', ')}
            meta={`${element.cardCount} cards`}
          />
        ))}
      </div>
    </div>
  )
}
