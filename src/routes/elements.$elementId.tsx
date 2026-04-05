import { createFileRoute, notFound } from '@tanstack/react-router'
import { CardThumb } from '#/components/CardThumb'
import { PageHeader } from '#/components/PageHeader'
import { getElement } from '#/lib/tarot.functions'
import { parsePositiveInt } from '#/lib/tarot'

export const Route = createFileRoute('/elements/$elementId')({
  loader: async ({ params }) => {
    const elementId = parsePositiveInt(params.elementId)
    const data = await getElement({ data: { elementId } })
    if (!data) {
      throw notFound()
    }

    return data
  },
  component: ElementDetailPage,
})

function ElementDetailPage() {
  const { element, cards } = Route.useLoaderData()

  return (
    <div className="space-y-8">
      <PageHeader
        backHref="/elements"
        backLabel="Elements"
        title={`${element?.symbol} ${element?.name}`}
        subtitle={element?.zodiacSigns.map((sign) => sign?.name).join(', ')}
      />

      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {cards.map((card) => (
          <CardThumb key={card.id} card={card} />
        ))}
      </div>
    </div>
  )
}
