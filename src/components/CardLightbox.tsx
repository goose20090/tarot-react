import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'

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
          className="focus-ring block w-full cursor-zoom-in overflow-hidden rounded-[2rem] border border-[var(--line)] bg-[var(--panel-muted)]"
        >
          <img src={imageUrl} alt={cardName} className="w-full object-cover" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
        <Dialog.Content className="fixed inset-0 z-50 grid place-items-center p-4">
          <div className="relative max-h-[90vh] max-w-[min(92vw,780px)]">
            <Dialog.Close asChild>
              <button
                type="button"
                className="focus-ring absolute right-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
            <img
              src={imageUrl}
              alt={cardName}
              className="max-h-[90vh] rounded-[2rem] border border-white/10 shadow-2xl"
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
