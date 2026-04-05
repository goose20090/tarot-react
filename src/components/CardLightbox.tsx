import * as Dialog from '@radix-ui/react-dialog'

type CardLightboxProps = {
  imageUrl: string | null
  cardName: string
}

export function CardLightbox({ imageUrl, cardName }: CardLightboxProps) {
  if (!imageUrl) {
    return (
      <div className="display-font flex aspect-[0.72] items-center justify-center rounded-[2rem] border border-[var(--line)] bg-[var(--panel-muted)] p-8 text-center text-3xl text-[var(--text-soft)]">
        {cardName}
      </div>
    )
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="focus-ring block w-full cursor-zoom-in"
        >
          <img src={imageUrl} alt={cardName} className="w-full rounded-xl" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
        <Dialog.Content className="fixed inset-0 z-50 grid place-items-center p-4">
          <Dialog.Close asChild>
            <button type="button" className="fixed inset-0 cursor-zoom-out" aria-label="Close" />
          </Dialog.Close>
          <img
            src={imageUrl}
            alt={cardName}
            className="relative z-10 max-h-[90vh] rounded-xl border border-white/10 shadow-2xl"
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
