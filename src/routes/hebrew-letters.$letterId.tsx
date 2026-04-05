import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { CardThumb } from '#/components/CardThumb'
import { MetaTable } from '#/components/MetaTable'
import { PageHeader } from '#/components/PageHeader'
import { getHebrewLetter } from '#/lib/tarot.functions'
import { parsePositiveInt } from '#/lib/tarot'

export const Route = createFileRoute('/hebrew-letters/$letterId')({
  loader: async ({ params }) => {
    const letterId = parsePositiveInt(params.letterId)
    const data = await getHebrewLetter({ data: { letterId } })
    if (!data) {
      throw notFound()
    }

    return data
  },
  component: HebrewLetterDetailPage,
})

function HebrewLetterDetailPage() {
  const { letter } = Route.useLoaderData()

  return (
    <div className="space-y-8">
      <PageHeader
        backHref="/hebrew-letters"
        backLabel="Hebrew Letters"
        eyebrow={letter?.letterType}
        title={`${letter?.letter} ${letter?.name}`}
        subtitle={letter?.meaning}
      />

      <section className="surface-panel-strong rounded-[2rem] p-6">
        <MetaTable
          items={[
            { label: 'Gematria', value: letter?.number },
            letter?.path
              ? {
                  label: 'Path',
                  value: (
                    <Link
                      to="/paths/$pathId"
                      params={{ pathId: String(letter.path.id) }}
                    >
                      Path {letter.path.number}
                    </Link>
                  ),
                }
              : null,
          ].filter(Boolean)}
        />
      </section>

      {letter?.path?.card ? (
        <section className="max-w-[280px]">
          <CardThumb card={letter.path.card} />
        </section>
      ) : null}
    </div>
  )
}
