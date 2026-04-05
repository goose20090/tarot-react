import { Outlet, createFileRoute, useRouterState } from '@tanstack/react-router'
import { EntityCard } from '#/components/EntityCard'
import { PageHeader } from '#/components/PageHeader'
import { getPaths } from '#/lib/tarot.functions'

export const Route = createFileRoute('/paths')({
  loader: () => getPaths(),
  component: PathsRouteComponent,
})

function PathsRouteComponent() {
  const isIndex = useRouterState({
    select: (state) => state.location.pathname === '/paths',
  })

  if (!isIndex) {
    return <Outlet />
  }

  return <PathsIndexPage />
}

function PathsIndexPage() {
  const { paths } = Route.useLoaderData()

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Reference"
        title="Paths"
        subtitle="The twenty-two paths of the Tree of Life, each carried by a Major Arcana and a Hebrew letter."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {paths.map((path) => (
          <EntityCard
            key={path.id}
            to="/paths/$pathId"
            params={{ pathId: String(path.id) }}
            icon={<span>{path.number}</span>}
            title={`${path.startSephira?.name} → ${path.endSephira?.name}`}
            subtitle={
              path.hebrewLetter
                ? `${path.hebrewLetter.letter} ${path.hebrewLetter.name} · ${path.hebrewLetter.meaning}`
                : undefined
            }
            meta={path.card?.name}
          />
        ))}
      </div>
    </div>
  )
}
