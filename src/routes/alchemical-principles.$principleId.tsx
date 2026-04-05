import { createFileRoute, notFound } from '@tanstack/react-router'
import { CardThumb } from '#/components/CardThumb'
import { PageHeader } from '#/components/PageHeader'
import { getPrinciple } from '#/lib/tarot.functions'
import { parsePositiveInt } from '#/lib/tarot'

export const Route = createFileRoute('/alchemical-principles/$principleId')({
  loader: async ({ params }) => {
    const principleId = parsePositiveInt(params.principleId)
    const data = await getPrinciple({ data: { principleId } })
    if (!data) {
      throw notFound()
    }

    return data
  },
  component: PrincipleDetailPage,
})

function PrincipleDetailPage() {
  const { principle, cards } = Route.useLoaderData()

  return (
    <div className="space-y-8">
      <PageHeader
        backHref="/alchemical-principles"
        backLabel="Alchemy"
        eyebrow={`Guna ${principle?.guna}`}
        title={`${principle?.symbol} ${principle?.name}`}
        subtitle={principle?.nature}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cards.map((card) => (
          <CardThumb key={card.id} card={card} />
        ))}
      </div>
    </div>
  )
}
