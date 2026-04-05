import {
  Link,
  Outlet,
  createFileRoute,
  useRouterState,
} from '@tanstack/react-router'
import { CardThumb } from '#/components/CardThumb'
import { PageHeader } from '#/components/PageHeader'
import { getReadings } from '#/lib/tarot.functions'

export const Route = createFileRoute('/readings')({
  loader: () => getReadings(),
  component: ReadingsRouteComponent,
})

function ReadingsRouteComponent() {
  const isIndex = useRouterState({
    select: (state) => state.location.pathname === '/readings',
  })

  if (!isIndex) {
    return <Outlet />
  }

  return <ReadingsPage />
}

function ReadingsPage() {
  const { readings } = Route.useLoaderData()

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Saved Work"
        title="Readings"
        subtitle="Review your previously created spreads, revisit significators, and continue expanding the interactive side of the app."
        actions={
          <Link
            to="/readings/new"
            className="focus-ring rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[var(--accent-strong)]"
          >
            New Reading
          </Link>
        }
      />

      {readings.length === 0 ? (
        <section className="surface-panel-strong rounded-[2rem] p-8 text-center">
          <h2 className="display-font m-0 text-4xl text-[var(--text)]">No readings yet</h2>
          <p className="mx-auto mb-0 max-w-xl pt-3 text-sm leading-7 text-[var(--text-soft)]">
            Start with a single card, a three-card pull, or jump straight into a
            Celtic Cross.
          </p>
        </section>
      ) : (
        <div className="grid gap-4">
          {readings.map((reading) => (
            <Link
              key={reading.id}
              to="/readings/$readingId"
              params={{ readingId: String(reading.id) }}
              className="surface-panel-strong focus-ring block rounded-[1.8rem] p-4 transition hover:-translate-y-1"
            >
              <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_160px] md:items-center">
                <div>
                  <p className="kicker m-0">{reading.spread.name}</p>
                  <h2 className="display-font m-0 pt-2 text-4xl text-[var(--text)]">
                    {reading.name || reading.spread.name}
                  </h2>
                  <p className="m-0 pt-3 text-sm text-[var(--text-soft)]">
                    Created {new Date(reading.createdAt).toLocaleDateString('en-GB')}
                  </p>
                </div>
                {reading.significatorCard ? <CardThumb card={reading.significatorCard} /> : null}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
