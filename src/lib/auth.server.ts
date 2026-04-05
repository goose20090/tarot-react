import { compare, hash } from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { redirect } from '@tanstack/react-router'
import { useSession } from '@tanstack/react-start/server'
import { db } from '#/db/client'
import { users } from '#/db/schema'

const sessionSecret =
  process.env.TAROT_SESSION_SECRET ??
  'tarot-dev-session-secret-please-change-me-before-production'

const sessionConfig = {
  name: 'tarot-session',
  password: sessionSecret,
  maxAge: 60 * 60 * 24 * 30,
  cookie: {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  },
}

export async function getAuthSession() {
  return useSession<{ userId?: number }>(sessionConfig)
}

export async function getCurrentUser() {
  const session = await getAuthSession()
  const userId = session.data.userId

  if (!userId) {
    return null
  }

  return (
    db.query.users.findFirst({
      where: eq(users.id, userId),
    }) ?? null
  )
}

export async function requireCurrentUser() {
  const user = await getCurrentUser()

  if (!user) {
    throw redirect({ to: '/sign-in' })
  }

  return user
}

export async function signInWithPassword(emailAddress: string, password: string) {
  const normalizedEmail = emailAddress.trim().toLowerCase()
  const user = await db.query.users.findFirst({
    where: eq(users.emailAddress, normalizedEmail),
  })

  if (!user) {
    return null
  }

  const matches = await compare(password, user.passwordHash)
  if (!matches) {
    return null
  }

  const session = await getAuthSession()
  await session.update({ userId: user.id })
  return user
}

export async function signOutCurrentUser() {
  const session = await getAuthSession()
  await session.clear()
}

export async function registerUser(input: {
  emailAddress: string
  password: string
  dateOfBirth: string
}) {
  const emailAddress = input.emailAddress.trim().toLowerCase()
  const existing = await db.query.users.findFirst({
    where: eq(users.emailAddress, emailAddress),
  })

  if (existing) {
    throw new Error('An account already exists for that email address.')
  }

  const passwordHash = await hash(input.password, 12)
  const [user] = await db
    .insert(users)
    .values({
      emailAddress,
      passwordHash,
      dateOfBirth: input.dateOfBirth,
    })
    .returning()

  const session = await getAuthSession()
  await session.update({ userId: user.id })
  return user
}
