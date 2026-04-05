import { createFileRoute, notFound } from '@tanstack/react-router'
import { CardThumb } from '#/components/CardThumb'
import { PageHeader } from '#/components/PageHeader'
import { getProfile } from '#/lib/tarot.functions'

export const Route = createFileRoute('/profile')({
  loader: async () => {
    const data = await getProfile()
    if (!data) {
      throw notFound()
    }

    return data
  },
  component: ProfilePage,
})

function ProfilePage() {
  const { user, profile } = Route.useLoaderData()

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Birthday Correspondences"
        title="Your Profile"
        subtitle={`${user.emailAddress} · Born ${user.formattedDateOfBirth} · ${profile.sunSign}`}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {[
          ['Significator', profile.courtCard],
          ['Decan Card', profile.decanCard],
          ['Elemental Ace', profile.elementalAce],
          ['Sun Sign Key', profile.sunSignCard],
          ['Planetary Ruler Key', profile.planetaryRulerCard],
        ].map(([label, card], index) => (
          <section
            key={label}
            className="surface-panel-strong rounded-[1.8rem] p-4 rise-in"
            style={{ animationDelay: `${index * 70}ms` }}
          >
            <p className="kicker m-0">{label}</p>
            <div className="pt-4">
              {card ? (
                <CardThumb card={card} />
              ) : (
                <div className="rounded-[1.5rem] border border-dashed border-[var(--line)] px-4 py-8 text-sm text-[var(--text-soft)]">
                  Not calculated
                </div>
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
