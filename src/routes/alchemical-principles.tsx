import { Outlet, createFileRoute, useRouterState } from '@tanstack/react-router'
import { CardThumb } from '#/components/CardThumb'
import { EntityCard } from '#/components/EntityCard'
import { PageHeader } from '#/components/PageHeader'
import { getAlchemy } from '#/lib/tarot.functions'

export const Route = createFileRoute('/alchemical-principles')({
  loader: () => getAlchemy(),
  component: AlchemyRouteComponent,
})

function AlchemyRouteComponent() {
  const isIndex = useRouterState({
    select: (state) => state.location.pathname === '/alchemical-principles',
  })

  if (!isIndex) {
    return <Outlet />
  }

  return <AlchemyIndexPage />
}

function AlchemyIndexPage() {
  const { principles, weddingCards } = Route.useLoaderData()

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Reference"
        title="Alchemical Principles"
        subtitle="The Tria Prima and the cards that most explicitly carry their symbolism."
      />

      <div className="flex flex-col gap-3">
        {principles.map((principle) => (
          <EntityCard
            key={principle.id}
            to="/alchemical-principles/$principleId"
            params={{ principleId: String(principle.id) }}
            icon={<span>{principle.symbol}</span>}
            title={principle.name}
            subtitle={principle.nature}
            meta={`Guna ${principle.guna} · ${principle.cardCount} cards`}
          />
        ))}
      </div>

      <section className="space-y-4">
        <h2 className="display-font m-0 text-4xl text-[var(--text)]">The Alchemical Wedding</h2>
        <div className="grid gap-5 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {weddingCards.map((card) => (
            <CardThumb key={card.id} card={card} />
          ))}
        </div>
      </section>
    </div>
  )
}
