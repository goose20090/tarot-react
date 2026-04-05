import { Outlet, createFileRoute, useRouterState } from '@tanstack/react-router'
import { EntityCard } from '#/components/EntityCard'
import { PageHeader } from '#/components/PageHeader'
import { getHebrewLetters } from '#/lib/tarot.functions'

export const Route = createFileRoute('/hebrew-letters')({
  loader: () => getHebrewLetters(),
  component: HebrewLettersRouteComponent,
})

function HebrewLettersRouteComponent() {
  const isIndex = useRouterState({
    select: (state) => state.location.pathname === '/hebrew-letters',
  })

  if (!isIndex) {
    return <Outlet />
  }

  return <HebrewLettersIndexPage />
}

function HebrewLettersIndexPage() {
  const { letters } = Route.useLoaderData()

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Reference"
        title="Hebrew Letters"
        subtitle="The 22 letters linked to the 22 paths of the Tree of Life."
      />

      <div className="flex flex-col gap-3">
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
