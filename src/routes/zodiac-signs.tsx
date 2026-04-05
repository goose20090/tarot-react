import { createFileRoute } from '@tanstack/react-router'
import { EntityCard } from '#/components/EntityCard'
import { PageHeader } from '#/components/PageHeader'
import { getZodiacSigns } from '#/lib/tarot.functions'

export const Route = createFileRoute('/zodiac-signs')({
  loader: () => getZodiacSigns(),
  component: ZodiacIndexPage,
})

function ZodiacIndexPage() {
  const { zodiacSigns } = Route.useLoaderData()

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Reference"
        title="Zodiac Signs"
        subtitle="Astrological correspondences of the Thoth Tarot."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {zodiacSigns.map((sign) => (
          <EntityCard
            key={sign.id}
            to="/zodiac-signs/$signId"
            params={{ signId: String(sign.id) }}
            icon={<span>{sign.symbol}</span>}
            title={sign.name}
            subtitle={`${sign.element?.name ?? ''} · ${sign.modality}`}
            meta={`${sign.cardCount} cards`}
          />
        ))}
      </div>
    </div>
  )
}
