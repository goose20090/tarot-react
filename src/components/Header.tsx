import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Link, useRouterState } from '@tanstack/react-router'
import { ChevronDown, LogOut, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { useServerFn } from '@tanstack/react-start'
import { signOut } from '#/lib/tarot.functions'
import { cn } from '#/utils/cn'

const referenceLinks = [
  { to: '/sephiroth', label: 'Sephiroth' },
  { to: '/paths', label: 'Paths' },
  { to: '/zodiac-signs', label: 'Zodiac' },
  { to: '/planets', label: 'Planets' },
  { to: '/elements', label: 'Elements' },
  { to: '/hebrew-letters', label: 'Hebrew' },
  { to: '/alchemical-principles', label: 'Alchemy' },
] as const

type HeaderProps = {
  currentUser: {
    id: number
    emailAddress: string
  } | null
}

function NavItem({
  to,
  children,
}: {
  to: string
  children: React.ReactNode
}) {
  return (
    <Link
      to={to}
      className="nav-link focus-ring rounded px-3 py-2 text-sm font-medium"
      activeProps={{ className: 'nav-link is-active focus-ring rounded px-3 py-2 text-sm font-medium' }}
    >
      {children}
    </Link>
  )
}

export default function Header({ currentUser }: HeaderProps) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const signOutFn = useServerFn(signOut)
  const [isPending, setIsPending] = useState(false)

  const isReferenceActive =
    pathname.startsWith('/sephiroth') ||
    pathname.startsWith('/paths') ||
    pathname.startsWith('/zodiac-signs') ||
    pathname.startsWith('/planets') ||
    pathname.startsWith('/elements') ||
    pathname.startsWith('/hebrew-letters') ||
    pathname.startsWith('/alchemical-principles')

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--panel-strong)] backdrop-blur-xl">
      <div className="app-shell flex items-center justify-between py-3">
        <Link
          to="/cards"
          className="focus-ring flex items-center gap-2.5 rounded py-1"
        >
          <Sparkles className="h-4 w-4 text-[var(--accent)]" />
          <span className="display-font text-xl leading-none text-[var(--text)]">
            Tarot Atlas
          </span>
        </Link>

        <nav className="flex flex-wrap items-center gap-0.5">
          <NavItem to="/cards">Cards</NavItem>
          <NavItem to="/tree">Tree</NavItem>
          <NavItem to="/readings">Readings</NavItem>
          {currentUser ? <NavItem to="/profile">Profile</NavItem> : null}

          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                className={cn(
                  'focus-ring inline-flex items-center gap-1.5 rounded px-3 py-2 text-sm font-medium transition',
                  isReferenceActive
                    ? 'text-[var(--accent-strong)]'
                    : 'text-[var(--text-soft)] hover:text-[var(--text)]',
                )}
              >
                Reference
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                sideOffset={8}
                align="end"
                className="surface-panel-strong z-50 min-w-44 rounded-xl p-1.5"
              >
                {referenceLinks.map((link) => (
                  <DropdownMenu.Item key={link.to} asChild>
                    <Link
                      to={link.to}
                      className="focus-ring block rounded-lg px-3 py-2 text-sm text-[var(--text-soft)] outline-none transition hover:bg-[var(--panel-muted)] hover:text-[var(--text)]"
                    >
                      {link.label}
                    </Link>
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>

          <div className="mx-1.5 h-4 w-px bg-[var(--line)]" />

          {currentUser ? (
            <button
              type="button"
              disabled={isPending}
              className="focus-ring inline-flex items-center gap-1.5 rounded px-3 py-2 text-sm text-[var(--text-soft)] transition hover:text-[var(--text)] disabled:cursor-not-allowed disabled:opacity-50"
              onClick={async () => {
                setIsPending(true)
                try {
                  await signOutFn()
                  window.location.href = '/sign-in'
                } finally {
                  setIsPending(false)
                }
              }}
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </button>
          ) : (
            <>
              <NavItem to="/sign-in">Sign in</NavItem>
              <NavItem to="/sign-up">Sign up</NavItem>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
