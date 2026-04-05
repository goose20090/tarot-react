import { createFileRoute, notFound } from '@tanstack/react-router'
import { CardThumb } from '#/components/CardThumb'
import { EntityCard } from '#/components/EntityCard'
import { PageHeader } from '#/components/PageHeader'
import { getSephira } from '#/lib/tarot.functions'
import { parsePositiveInt } from '#/lib/tarot'

export const Route = createFileRoute('/sephiroth/$sephiraId')({
  loader: async ({ params }) => {
    const sephiraId = parsePositiveInt(params.sephiraId)
    const data = await getSephira({ data: { sephiraId } })
    if (!data) {
      throw notFound()
    }

    return data
  },
  component: SephiraDetailPage,
})

function SephiraDetailPage() {
  const { sephira, cards, paths } = Route.useLoaderData()

  return (
    <div className="space-y-8">
      <PageHeader
        backHref="/sephiroth"
        backLabel="Sephiroth"
        eyebrow={`Sphere ${sephira.number}`}
        title={sephira.name}
        subtitle={sephira.meaning}
      />

      {cards.length > 0 ? (
        <section className="space-y-4">
          <h2 className="display-font m-0 text-4xl text-[var(--text)]">Cards in {sephira.name}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {cards.map((card) => (
              <CardThumb key={card.id} card={card} />
            ))}
          </div>
        </section>
      ) : null}

      {paths.length > 0 ? (
        <section className="space-y-4">
          <h2 className="display-font m-0 text-4xl text-[var(--text)]">Connected Paths</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {paths.map((path) => (
              <EntityCard
                key={path.id}
                to="/paths/$pathId"
                params={{ pathId: String(path.id) }}
                icon={<span>{path.number}</span>}
                title={`${path.startSephira?.name} → ${path.endSephira?.name}`}
                subtitle={path.card?.name}
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}
