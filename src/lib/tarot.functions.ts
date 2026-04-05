import { createServerFn } from '@tanstack/react-start'
import {
  getCurrentUser,
  registerUser,
  requireCurrentUser,
  signInWithPassword,
  signOutCurrentUser,
} from '#/lib/auth.server'
import {
  createReadingForUser,
  getAlchemyDetail,
  getAlchemyListData,
  getCardDetail,
  getCardsPageData,
  getElementDetail,
  getElementsListData,
  getHebrewLetterDetail,
  getHebrewLettersListData,
  getPathDetail,
  getPathsListData,
  getPlanetDetail,
  getPlanetsListData,
  getProfilePageData,
  getReadingBuilderData,
  getReadingDetail,
  getReadingsIndexData,
  getSephiraDetail,
  getSephirothListData,
  getTreePageData,
  getZodiacDetail,
  getZodiacListData,
} from '#/lib/tarot.server'

function requireNonEmptyString(value: unknown, label: string) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`${label} is required.`)
  }

  return value
}

function requireDate(value: unknown) {
  const date = requireNonEmptyString(value, 'Date of birth')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error('Date of birth must be in YYYY-MM-DD format.')
  }

  return date
}

export const getShellData = createServerFn({ method: 'GET' }).handler(async () => {
  const user = await getCurrentUser()
  return {
    currentUser: user
      ? {
          id: user.id,
          emailAddress: user.emailAddress,
          dateOfBirth: user.dateOfBirth,
        }
      : null,
  }
})

export const createAccount = createServerFn({ method: 'POST' })
  .inputValidator((data: {
    emailAddress: unknown
    password: unknown
    dateOfBirth: unknown
  }) => ({
    emailAddress: requireNonEmptyString(data.emailAddress, 'Email address'),
    password: requireNonEmptyString(data.password, 'Password'),
    dateOfBirth: requireDate(data.dateOfBirth),
  }))
  .handler(async ({ data }) => {
    if (data.password.length < 8) {
      throw new Error('Password must be at least 8 characters long.')
    }

    const user = await registerUser(data)
    return {
      user: {
        id: user.id,
        emailAddress: user.emailAddress,
      },
    }
  })

export const signIn = createServerFn({ method: 'POST' })
  .inputValidator((data: { emailAddress: unknown; password: unknown }) => ({
    emailAddress: requireNonEmptyString(data.emailAddress, 'Email address'),
    password: requireNonEmptyString(data.password, 'Password'),
  }))
  .handler(async ({ data }) => {
    const user = await signInWithPassword(data.emailAddress, data.password)

    if (!user) {
      throw new Error('Try another email address or password.')
    }

    return {
      user: {
        id: user.id,
        emailAddress: user.emailAddress,
      },
    }
  })

export const signOut = createServerFn({ method: 'POST' }).handler(async () => {
  await signOutCurrentUser()
  return { ok: true }
})

export const getCards = createServerFn({ method: 'GET' })
  .inputValidator((data: { arcana?: 'major' | 'minor'; suit?: keyof typeof import('#/lib/tarot').suitIcons }) => data)
  .handler(async ({ data }) => getCardsPageData(data ?? {}))

export const getCard = createServerFn({ method: 'GET' })
  .inputValidator((data: { cardId: number }) => data)
  .handler(async ({ data }) => getCardDetail(data.cardId))

export const getSephiroth = createServerFn({ method: 'GET' }).handler(async () => {
  return getSephirothListData()
})

export const getSephira = createServerFn({ method: 'GET' })
  .inputValidator((data: { sephiraId: number }) => data)
  .handler(async ({ data }) => getSephiraDetail(data.sephiraId))

export const getPaths = createServerFn({ method: 'GET' }).handler(async () => {
  return getPathsListData()
})

export const getPath = createServerFn({ method: 'GET' })
  .inputValidator((data: { pathId: number }) => data)
  .handler(async ({ data }) => getPathDetail(data.pathId))

export const getZodiacSigns = createServerFn({ method: 'GET' }).handler(async () => {
  return getZodiacListData()
})

export const getZodiacSign = createServerFn({ method: 'GET' })
  .inputValidator((data: { signId: number }) => data)
  .handler(async ({ data }) => getZodiacDetail(data.signId))

export const getPlanets = createServerFn({ method: 'GET' }).handler(async () => {
  return getPlanetsListData()
})

export const getPlanet = createServerFn({ method: 'GET' })
  .inputValidator((data: { planetId: number }) => data)
  .handler(async ({ data }) => getPlanetDetail(data.planetId))

export const getElements = createServerFn({ method: 'GET' }).handler(async () => {
  return getElementsListData()
})

export const getElement = createServerFn({ method: 'GET' })
  .inputValidator((data: { elementId: number }) => data)
  .handler(async ({ data }) => getElementDetail(data.elementId))

export const getHebrewLetters = createServerFn({ method: 'GET' }).handler(async () => {
  return getHebrewLettersListData()
})

export const getHebrewLetter = createServerFn({ method: 'GET' })
  .inputValidator((data: { letterId: number }) => data)
  .handler(async ({ data }) => getHebrewLetterDetail(data.letterId))

export const getAlchemy = createServerFn({ method: 'GET' }).handler(async () => {
  return getAlchemyListData()
})

export const getPrinciple = createServerFn({ method: 'GET' })
  .inputValidator((data: { principleId: number }) => data)
  .handler(async ({ data }) => getAlchemyDetail(data.principleId))

export const getTree = createServerFn({ method: 'GET' }).handler(async () => {
  return getTreePageData()
})

export const getProfile = createServerFn({ method: 'GET' }).handler(async () => {
  const user = await requireCurrentUser()
  return getProfilePageData(user.id)
})

export const getReadings = createServerFn({ method: 'GET' }).handler(async () => {
  const user = await requireCurrentUser()
  return getReadingsIndexData(user.id)
})

export const getReadingBuilder = createServerFn({ method: 'GET' })
  .inputValidator((data: { spreadId?: number }) => data)
  .handler(async ({ data }) => {
    const user = await requireCurrentUser()
    return getReadingBuilderData(user.id, data?.spreadId)
  })

export const saveReading = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: {
      spreadId: unknown
      name?: unknown
      significatorCardId?: unknown
      positionCards: Array<{ spreadPositionId: unknown; cardId: unknown }>
    }) => ({
      spreadId: Number(data.spreadId),
      name: typeof data.name === 'string' ? data.name : undefined,
      significatorCardId:
        typeof data.significatorCardId === 'number'
          ? data.significatorCardId
          : data.significatorCardId === null || data.significatorCardId === undefined
            ? null
            : Number(data.significatorCardId),
      positionCards: Array.isArray(data.positionCards)
        ? data.positionCards.map((entry) => ({
            spreadPositionId: Number(entry.spreadPositionId),
            cardId: Number(entry.cardId),
          }))
        : [],
    }),
  )
  .handler(async ({ data }) => {
    const user = await requireCurrentUser()
    const reading = await createReadingForUser({
      userId: user.id,
      spreadId: data.spreadId,
      name: data.name,
      significatorCardId: data.significatorCardId,
      positionCards: data.positionCards,
    })

    return { readingId: reading.id }
  })

export const getReading = createServerFn({ method: 'GET' })
  .inputValidator((data: { readingId: number }) => data)
  .handler(async ({ data }) => {
    const user = await requireCurrentUser()
    return getReadingDetail(user.id, data.readingId)
  })
