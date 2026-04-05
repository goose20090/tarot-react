export default function Footer() {
  return (
    <footer className="border-t border-[var(--line)] py-10">
      <div className="app-shell flex flex-col gap-3 text-sm text-[var(--text-muted)] md:flex-row md:items-center md:justify-between">
        <p className="m-0">A React rebuild of the Thoth Tarot study app.</p>
        <p className="m-0">Built on TanStack Start, Drizzle, Tailwind, and Radix.</p>
      </div>
    </footer>
  )
}
