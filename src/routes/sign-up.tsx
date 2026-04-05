import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useServerFn } from '@tanstack/react-start'
import { PageHeader } from '#/components/PageHeader'
import { createAccount, getShellData } from '#/lib/tarot.functions'

export const Route = createFileRoute('/sign-up')({
  loader: async () => {
    const shell = await getShellData()
    if (shell.currentUser) {
      throw redirect({ to: '/profile' })
    }

    return null
  },
  component: SignUpPage,
})

function SignUpPage() {
  const navigate = useNavigate()
  const createAccountFn = useServerFn(createAccount)
  const [emailAddress, setEmailAddress] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        eyebrow="Create Your Profile"
        title="Sign Up"
        subtitle="Your birthday powers the significator, decan, elemental ace, and sun-sign keys used throughout the app."
      />

      <section className="surface-panel-strong ornate-border rounded-[2rem] p-6 md:p-8">
        <div className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm text-[var(--text-soft)]">Email address</span>
            <input
              value={emailAddress}
              onChange={(event) => setEmailAddress(event.target.value)}
              className="focus-ring w-full rounded-2xl border border-[var(--line)] bg-[var(--panel-muted)] px-4 py-3 text-[var(--text)]"
              type="email"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-[var(--text-soft)]">Date of birth</span>
            <input
              value={dateOfBirth}
              onChange={(event) => setDateOfBirth(event.target.value)}
              className="focus-ring w-full rounded-2xl border border-[var(--line)] bg-[var(--panel-muted)] px-4 py-3 text-[var(--text)]"
              type="date"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-[var(--text-soft)]">Password</span>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="focus-ring w-full rounded-2xl border border-[var(--line)] bg-[var(--panel-muted)] px-4 py-3 text-[var(--text)]"
              type="password"
            />
          </label>

          {error ? (
            <div className="rounded-2xl border border-[rgba(160,75,95,0.42)] bg-[rgba(160,75,95,0.1)] px-4 py-3 text-sm text-[rgb(245,212,220)]">
              {error}
            </div>
          ) : null}

          <button
            type="button"
            disabled={isSubmitting}
            onClick={async () => {
              setError(null)
              setIsSubmitting(true)
              try {
                await createAccountFn({
                  data: {
                    emailAddress,
                    dateOfBirth,
                    password,
                  },
                })
                await navigate({ to: '/profile' })
              } catch (caught) {
                setError(
                  caught instanceof Error
                    ? caught.message
                    : 'Unable to create the account.',
                )
              } finally {
                setIsSubmitting(false)
              }
            }}
            className="focus-ring rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[var(--accent-strong)] disabled:opacity-60"
          >
            {isSubmitting ? 'Creating…' : 'Create Account'}
          </button>
        </div>
      </section>
    </div>
  )
}
