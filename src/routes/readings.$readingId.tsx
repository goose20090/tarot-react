import { createFileRoute, notFound } from '@tanstack/react-router'
import { CardThumb } from '#/components/CardThumb'
import { PageHeader } from '#/components/PageHeader'
import { getReading } from '#/lib/tarot.functions'
import { parsePositiveInt } from '#/lib/tarot'

export const Route = createFileRoute('/readings/$readingId')({
  loader: async ({ params }) => {
    const readingId = parsePositiveInt(params.readingId)
    const data = await getReading({ data: { readingId } })
    if (!data) {
      throw notFound()
    }

    return data
  },
  component: ReadingDetailPage,
})

function ReadingDetailPage() {
  const { reading } = Route.useLoaderData()

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={reading.spread.name}
        title={reading.name || reading.spread.name}
        subtitle={`Created ${new Date(reading.createdAt).toLocaleDateString('en-GB')}`}
        backHref="/readings"
        backLabel="Readings"
      />

      {reading.significatorCard ? (
        <section className="surface-panel-strong rounded-[1.8rem] p-5">
          <p className="kicker m-0">Significator</p>
          <div className="pt-4 max-w-[240px]">
            <CardThumb card={reading.significatorCard} />
          </div>
        </section>
      ) : null}

      <section className="space-y-4">
        <h2 className="display-font m-0 text-4xl text-[var(--text)]">Cards</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {reading.positions.map((position) => (
            <article key={position.id} className="surface-panel-strong rounded-[1.8rem] p-4">
              <p className="kicker m-0">{position.name || `Position ${position.number}`}</p>
              <div className="pt-4">
                {position.card ? (
                  <CardThumb card={position.card} />
                ) : (
                  <div className="rounded-[1.5rem] border border-dashed border-[var(--line)] px-4 py-10 text-center text-sm text-[var(--text-soft)]">
                    Not drawn
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
