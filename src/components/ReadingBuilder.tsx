import { Link, useNavigate } from '@tanstack/react-router'
import { Shuffle, Sparkles, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useServerFn } from '@tanstack/react-start'
import { saveReading } from '#/lib/tarot.functions'
import { CardPickerDialog } from './CardPickerDialog'
import { CardThumb } from './CardThumb'
import { PageHeader } from './PageHeader'

type BuilderCard = {
  id: number
  name: string
  arcana: 'major' | 'minor'
  suit: 'wands' | 'cups' | 'swords' | 'disks' | null
  badge: string
  thumbUrl: string | null
}

type SpreadPosition = {
  id: number
  number: number
  name: string | null
  significator: boolean
}

type ReadingBuilderProps = {
  spread: {
    id: number
    name: string
    description: string
    positions: SpreadPosition[]
  }
  cards: BuilderCard[]
  significatorCard: BuilderCard | null
}

export function ReadingBuilder({
  spread,
  cards,
  significatorCard,
}: ReadingBuilderProps) {
  const navigate = useNavigate()
  const saveReadingFn = useServerFn(saveReading)
  const [readingName, setReadingName] = useState('')
  const [activeSlotId, setActiveSlotId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const significatorPosition = spread.positions.find((position) => position.significator) ?? null
  const layoutPositions = spread.positions.filter((position) => !position.significator)

  const initialSelections = useMemo(() => {
    const next: Record<number, BuilderCard | null> = {}
    for (const position of layoutPositions) {
      next[position.id] = null
    }
    if (significatorPosition) {
      next[significatorPosition.id] = significatorCard
    }
    return next
  }, [layoutPositions, significatorCard, significatorPosition])

  const [selectedCards, setSelectedCards] =
    useState<Record<number, BuilderCard | null>>(initialSelections)

  const unavailableCardIds = Object.entries(selectedCards)
    .filter(([slotId, card]) => Number(slotId) !== activeSlotId && card)
    .map(([, card]) => card!.id)

  function setSlotCard(slotId: number, card: BuilderCard | null) {
    setSelectedCards((current) => ({
      ...current,
      [slotId]: card,
    }))
  }

  function drawRandom(slotId: number) {
    const usedIds = new Set(Object.values(selectedCards).flatMap((card) => (card ? [card.id] : [])))
    const current = selectedCards[slotId]
    if (current) {
      usedIds.delete(current.id)
    }
    const available = cards.filter((card) => !usedIds.has(card.id))
    if (available.length === 0) return
    const picked = available[Math.floor(Math.random() * available.length)]
    setSlotCard(slotId, picked)
  }

  function drawAll() {
    for (const position of layoutPositions) {
      if (!selectedCards[position.id]) {
        drawRandom(position.id)
      }
    }
  }

  async function handleSave() {
    setError(null)
    setIsSaving(true)

    try {
      const payload = [
        ...layoutPositions,
        ...(significatorPosition ? [significatorPosition] : []),
      ]
        .map((position) => ({
          spreadPositionId: position.id,
          cardId: selectedCards[position.id]?.id ?? null,
        }))
        .filter((entry) => entry.cardId !== null) as Array<{
        spreadPositionId: number
        cardId: number
      }>

      const result = await saveReadingFn({
        data: {
          spreadId: spread.id,
          name: readingName,
          significatorCardId: significatorCard?.id ?? null,
          positionCards: payload,
        },
      })

      await navigate({
        to: '/readings/$readingId',
        params: {
          readingId: String(result.readingId),
        },
      })
    } catch (caught) {
      const message =
        caught instanceof Error ? caught.message : 'Unable to save the reading.'
      setError(message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Build a Reading"
        title={spread.name}
        subtitle={spread.description}
        backHref="/readings/new"
        backLabel="Choose Spread"
        actions={
          layoutPositions.length > 1 ? (
            <button
              type="button"
              onClick={drawAll}
              className="focus-ring inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-4 py-2 text-sm text-[var(--text-soft)] transition hover:border-[var(--line-strong)] hover:text-[var(--text)]"
            >
              <Shuffle className="h-4 w-4" />
              Draw All
            </button>
          ) : null
        }
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <section className="surface-panel-strong ornate-border rounded-[2rem] p-5 md:p-7">
          <div className="mb-5">
            <label className="mb-2 block text-sm text-[var(--text-soft)]" htmlFor="reading-name">
              Reading name
            </label>
            <input
              id="reading-name"
              value={readingName}
              onChange={(event) => setReadingName(event.target.value)}
              placeholder="Morning reflection"
              className="focus-ring w-full rounded-2xl border border-[var(--line)] bg-[var(--panel-muted)] px-4 py-3 text-[var(--text)] placeholder:text-[var(--text-muted)]"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="display-font m-0 text-3xl text-[var(--text)]">Spread Layout</h2>
              <span className="text-sm text-[var(--text-muted)]">
                {layoutPositions.length} positions
              </span>
            </div>

            {significatorPosition ? (
              <div className="surface-panel rounded-[1.7rem] p-4">
                <div className="mb-3 flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-[var(--text-muted)]">
                  <Sparkles className="h-4 w-4" />
                  Significator
                </div>
                {significatorCard ? (
                  <div className="grid gap-4 md:grid-cols-[160px_minmax(0,1fr)] md:items-center">
                    <CardThumb card={significatorCard} />
                    <div className="text-sm text-[var(--text-soft)]">
                      Your profile-derived court card is preloaded here and saved
                      alongside this reading.
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-[var(--line)] px-4 py-5 text-sm text-[var(--text-soft)]">
                    No significator is available yet. Add a birthday on signup to
                    generate one automatically.
                  </div>
                )}
              </div>
            ) : null}

            <div className="grid gap-4 md:grid-cols-2">
              {layoutPositions.map((position) => {
                const card = selectedCards[position.id]
                return (
                  <article key={position.id} className="surface-panel rounded-[1.7rem] p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div>
                        <p className="m-0 text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
                          Position {position.number}
                        </p>
                        <h3 className="display-font m-0 text-2xl text-[var(--text)]">
                          {position.name ?? `Card ${position.number}`}
                        </h3>
                      </div>
                      {card ? (
                        <button
                          type="button"
                          onClick={() => setSlotCard(position.id, null)}
                          className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] text-[var(--text-soft)] transition hover:text-[var(--text)]"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      ) : null}
                    </div>

                    {card ? (
                      <CardThumb card={card} />
                    ) : (
                      <div className="display-font flex aspect-[0.72] items-center justify-center rounded-[1.4rem] border border-dashed border-[var(--line)] bg-[var(--panel-muted)] text-center text-3xl text-[var(--text-soft)]">
                        Awaiting draw
                      </div>
                    )}

                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => drawRandom(position.id)}
                        className="focus-ring inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-3 py-2 text-sm text-[var(--text-soft)] transition hover:border-[var(--line-strong)] hover:text-[var(--text)]"
                      >
                        <Shuffle className="h-4 w-4" />
                        Draw
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveSlotId(position.id)}
                        className="focus-ring inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-3 py-2 text-sm text-[var(--text-soft)] transition hover:border-[var(--line-strong)] hover:text-[var(--text)]"
                      >
                        Pick
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>

          {error ? (
            <div className="mt-5 rounded-2xl border border-[rgba(160,75,95,0.44)] bg-[rgba(160,75,95,0.1)] px-4 py-3 text-sm text-[rgb(245,212,220)]">
              {error}
            </div>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={isSaving}
              onClick={handleSave}
              className="focus-ring rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[var(--accent-strong)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? 'Saving…' : 'Save Reading'}
            </button>
            <Link
              to="/readings"
              className="focus-ring rounded-full border border-[var(--line)] px-4 py-3 text-sm text-[var(--text-soft)] transition hover:border-[var(--line-strong)] hover:text-[var(--text)]"
            >
              Cancel
            </Link>
          </div>
        </section>

        <aside className="surface-panel rounded-[2rem] p-5 md:p-7">
          <p className="kicker m-0">How It Works</p>
          <h2 className="display-font m-0 pt-2 text-4xl text-[var(--text)]">
            Compose, draw, or curate.
          </h2>
          <div className="mt-4 space-y-3 text-sm leading-7 text-[var(--text-soft)]">
            <p className="m-0">
              Use <strong>Draw</strong> for chance, <strong>Pick</strong> for a
              deliberate selection, or mix both approaches in the same spread.
            </p>
            <p className="m-0">
              The builder prevents the same card from appearing twice in one
              reading. Your significator is carried automatically from your
              birthday profile when available.
            </p>
          </div>
        </aside>
      </div>

      <CardPickerDialog
        open={activeSlotId !== null}
        onOpenChange={(open) => {
          if (!open) setActiveSlotId(null)
        }}
        cards={cards}
        unavailableCardIds={unavailableCardIds}
        onPick={(card) => {
          if (activeSlotId !== null) {
            setSlotCard(activeSlotId, card)
          }
        }}
      />
    </>
  )
}
