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
      className="nav-link focus-ring rounded-full px-3 py-2 text-sm font-medium"
      activeProps={{ className: 'nav-link is-active focus-ring rounded-full px-3 py-2 text-sm font-medium' }}
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

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[rgba(10,8,13,0.72)] backdrop-blur-xl">
      <div className="app-shell flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/cards"
            className="surface-panel focus-ring ornate-border inline-flex items-center gap-3 rounded-full px-4 py-2 text-sm"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[radial-gradient(circle,_rgba(240,202,129,0.24),transparent_68%)] text-[var(--accent-strong)]">
              <Sparkles className="h-4 w-4" />
            </span>
            <span>
              <span className="block text-[0.7rem] uppercase tracking-[0.22em] text-[var(--text-muted)]">
                Thoth Tarot
              </span>
              <span className="display-font block text-xl leading-none text-[var(--text)]">
                Tarot Atlas
              </span>
            </span>
          </Link>
          {currentUser ? (
            <div className="hidden rounded-full border border-[var(--line)] bg-[var(--panel-muted)] px-3 py-2 text-xs text-[var(--text-soft)] md:block">
              {currentUser.emailAddress}
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <NavItem to="/cards">Cards</NavItem>
          <NavItem to="/tree">Tree</NavItem>
          <NavItem to="/readings">Readings</NavItem>
          {currentUser ? <NavItem to="/profile">Profile</NavItem> : null}

          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                className={cn(
                  'surface-panel focus-ring inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-[var(--text-soft)] transition hover:text-[var(--text)]',
                  pathname.startsWith('/sephiroth') ||
                    pathname.startsWith('/paths') ||
                    pathname.startsWith('/zodiac-signs') ||
                    pathname.startsWith('/planets') ||
                    pathname.startsWith('/elements') ||
                    pathname.startsWith('/hebrew-letters') ||
                    pathname.startsWith('/alchemical-principles')
                    ? 'text-[var(--text)]'
                    : '',
                )}
              >
                Reference
                <ChevronDown className="h-4 w-4" />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                sideOffset={10}
                align="end"
                className="surface-panel-strong z-50 min-w-56 rounded-2xl p-2"
              >
                {referenceLinks.map((link) => (
                  <DropdownMenu.Item key={link.to} asChild>
                    <Link
                      to={link.to}
                      className="focus-ring block rounded-xl px-3 py-2 text-sm text-[var(--text-soft)] outline-none transition hover:bg-[var(--panel-muted)] hover:text-[var(--text)]"
                    >
                      {link.label}
                    </Link>
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>

          {currentUser ? (
            <button
              type="button"
              disabled={isPending}
              className="focus-ring inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-3 py-2 text-sm text-[var(--text-soft)] transition hover:border-[var(--line-strong)] hover:text-[var(--text)] disabled:cursor-not-allowed disabled:opacity-50"
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
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          ) : (
            <>
              <NavItem to="/sign-in">Sign In</NavItem>
              <NavItem to="/sign-up">Sign Up</NavItem>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
