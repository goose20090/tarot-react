import { createFileRoute } from '@tanstack/react-router'
import { EntityCard } from '#/components/EntityCard'
import { PageHeader } from '#/components/PageHeader'
import { getHebrewLetters } from '#/lib/tarot.functions'

export const Route = createFileRoute('/hebrew-letters')({
  loader: () => getHebrewLetters(),
  component: HebrewLettersIndexPage,
})

function HebrewLettersIndexPage() {
  const { letters } = Route.useLoaderData()

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Reference"
        title="Hebrew Letters"
        subtitle="The 22 letters linked to the 22 paths of the Tree of Life."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {letters.map((letter) => (
          <EntityCard
            key={letter.id}
            to="/hebrew-letters/$letterId"
            params={{ letterId: String(letter.id) }}
            icon={<span>{letter.letter}</span>}
            title={letter.name}
            subtitle={`${letter.meaning} · ${letter.letterType}`}
            meta={letter.path?.card?.name}
          />
        ))}
      </div>
    </div>
  )
}
