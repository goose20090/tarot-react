import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { CardThumb } from '#/components/CardThumb'
import { MetaTable } from '#/components/MetaTable'
import { PageHeader } from '#/components/PageHeader'
import { getPath } from '#/lib/tarot.functions'
import { parsePositiveInt } from '#/lib/tarot'

export const Route = createFileRoute('/paths/$pathId')({
  loader: async ({ params }) => {
    const pathId = parsePositiveInt(params.pathId)
    const data = await getPath({ data: { pathId } })
    if (!data) {
      throw notFound()
    }

    return data
  },
  component: PathDetailPage,
})

function PathDetailPage() {
  const { path } = Route.useLoaderData()

  return (
    <div className="space-y-8">
      <PageHeader
        backHref="/paths"
        backLabel="Paths"
        eyebrow={`Path ${path.number}`}
        title={`${path.startSephira?.name} → ${path.endSephira?.name}`}
      />

      <section className="surface-panel-strong rounded-[2rem] p-6">
        <MetaTable
          items={[
            {
              label: 'Start',
              value: path.startSephira ? (
                <Link
                  to="/sephiroth/$sephiraId"
                  params={{ sephiraId: String(path.startSephira.id) }}
                >
                  {path.startSephira.number}. {path.startSephira.name}
                </Link>
              ) : null,
            },
            {
              label: 'End',
              value: path.endSephira ? (
                <Link
                  to="/sephiroth/$sephiraId"
                  params={{ sephiraId: String(path.endSephira.id) }}
                >
                  {path.endSephira.number}. {path.endSephira.name}
                </Link>
              ) : null,
            },
            path.hebrewLetter
              ? {
                  label: 'Hebrew Letter',
                  value: (
                    <Link
                      to="/hebrew-letters/$letterId"
                      params={{ letterId: String(path.hebrewLetter.id) }}
                    >
                      {path.hebrewLetter.letter} {path.hebrewLetter.name} ·{' '}
                      {path.hebrewLetter.meaning}
                    </Link>
                  ),
                }
              : null,
          ].filter(Boolean)}
        />
      </section>

      {path.card ? (
        <section className="max-w-[280px]">
          <CardThumb card={path.card} />
        </section>
      ) : null}
    </div>
  )
}
