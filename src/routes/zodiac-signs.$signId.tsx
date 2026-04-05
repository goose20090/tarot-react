import { createFileRoute, notFound } from '@tanstack/react-router'
import { CardThumb } from '#/components/CardThumb'
import { PageHeader } from '#/components/PageHeader'
import { getZodiacSign } from '#/lib/tarot.functions'
import { parsePositiveInt } from '#/lib/tarot'

export const Route = createFileRoute('/zodiac-signs/$signId')({
  loader: async ({ params }) => {
    const signId = parsePositiveInt(params.signId)
    const data = await getZodiacSign({ data: { signId } })
    if (!data) {
      throw notFound()
    }

    return data
  },
  component: ZodiacDetailPage,
})

function ZodiacDetailPage() {
  const { zodiacSign, cards } = Route.useLoaderData()

  return (
    <div className="space-y-8">
      <PageHeader
        backHref="/zodiac-signs"
        backLabel="Zodiac"
        eyebrow={zodiacSign?.modality}
        title={`${zodiacSign?.symbol} ${zodiacSign?.name}`}
        subtitle={zodiacSign?.element ? `${zodiacSign.element.symbol} ${zodiacSign.element.name}` : undefined}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cards.map((card) => (
          <CardThumb key={card.id} card={card} />
        ))}
      </div>
    </div>
  )
}
