import * as Dialog from '@radix-ui/react-dialog'
import * as Tabs from '@radix-ui/react-tabs'
import { X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { cn } from '#/utils/cn'

type PickerCard = {
  id: number
  name: string
  arcana: 'major' | 'minor'
  suit: 'wands' | 'cups' | 'swords' | 'disks' | null
  badge: string
  thumbUrl: string | null
}

type CardPickerDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  cards: PickerCard[]
  unavailableCardIds: number[]
  onPick: (card: PickerCard) => void
}

const filters = [
  { value: 'all', label: 'All' },
  { value: 'major', label: 'Major' },
  { value: 'wands', label: 'Wands' },
  { value: 'cups', label: 'Cups' },
  { value: 'swords', label: 'Swords' },
  { value: 'disks', label: 'Disks' },
] as const

export function CardPickerDialog({
  open,
  onOpenChange,
  cards,
  unavailableCardIds,
  onPick,
}: CardPickerDialogProps) {
  const [filter, setFilter] = useState<(typeof filters)[number]['value']>('all')
  const unavailableSet = useMemo(() => new Set(unavailableCardIds), [unavailableCardIds])
  const visibleCards = useMemo(
    () =>
      cards.filter((card) => {
        if (filter === 'all') return true
        if (filter === 'major') return card.arcana === 'major'
        return card.suit === filter
      }),
    [cards, filter],
  )

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/68 backdrop-blur-sm" />
        <Dialog.Content className="fixed inset-0 z-50 grid place-items-center p-3 md:p-6">
          <div className="surface-panel-strong flex h-[min(88vh,920px)] w-full max-w-6xl flex-col rounded-[2rem] p-4 md:p-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <Dialog.Title className="display-font text-3xl text-[var(--text)]">
                  Choose a Card
                </Dialog.Title>
                <p className="m-0 text-sm text-[var(--text-soft)]">
                  Cards already used in this spread are disabled.
                </p>
              </div>
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--line)] text-[var(--text-soft)] transition hover:text-[var(--text)]"
                >
                  <X className="h-5 w-5" />
                </button>
              </Dialog.Close>
            </div>

            <Tabs.Root value={filter} onValueChange={(value) => setFilter(value as typeof filter)}>
              <Tabs.List className="mb-4 flex flex-wrap gap-2">
                {filters.map((entry) => (
                  <Tabs.Trigger
                    key={entry.value}
                    value={entry.value}
                    className="focus-ring rounded-full border border-[var(--line)] px-3 py-2 text-sm text-[var(--text-soft)] transition data-[state=active]:border-[var(--line-strong)] data-[state=active]:bg-[var(--panel-muted)] data-[state=active]:text-[var(--text)]"
                  >
                    {entry.label}
                  </Tabs.Trigger>
                ))}
              </Tabs.List>
            </Tabs.Root>

            <div className="grid flex-1 grid-cols-2 gap-3 overflow-y-auto pr-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {visibleCards.map((card) => {
                const unavailable = unavailableSet.has(card.id)
                return (
                  <button
                    key={card.id}
                    type="button"
                    disabled={unavailable}
                    onClick={() => {
                      onPick(card)
                      onOpenChange(false)
                    }}
                    className={cn(
                      'focus-ring surface-panel flex flex-col gap-3 rounded-[1.5rem] p-3 text-left transition hover:-translate-y-1 hover:border-[var(--accent)] hover:shadow-[0_8px_24px_rgba(201,168,76,0.2)] disabled:cursor-not-allowed disabled:opacity-35',
                      unavailable ? '' : 'hover:text-[var(--text)]',
                    )}
                  >
                    <div className="overflow-hidden rounded-[1rem] border border-[var(--line)]">
                      {card.thumbUrl ? (
                        <img
                          src={card.thumbUrl}
                          alt={card.name}
                          className="aspect-[9/15] w-full object-cover object-top"
                        />
                      ) : (
                        <div className="display-font flex aspect-[0.72] items-center justify-center bg-[var(--panel-muted)] p-4 text-center text-xl text-[var(--text-soft)]">
                          {card.name}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="m-0 text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
                        {card.badge}
                      </p>
                      <p className="display-font m-0 pt-1 text-2xl leading-tight text-[var(--text)]">
                        {card.name}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
