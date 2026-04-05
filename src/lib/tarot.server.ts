import { and, eq } from 'drizzle-orm'
import { db } from '#/db/client'
import {
  alchemicalPrinciples,
  cards,
  elements,
  hebrewLetters,
  paths,
  planets,
  readings,
  readingCards,
  sephiroth,
  spreadPositions,
  spreads,
  users,
  zodiacSigns,
} from '#/db/schema'
import { getBirthdayProfile } from '#/lib/birthday'
import {
  formatLongDate,
  getCardImageUrl,
  getCardThumbUrl,
  rankOrder,
  suitIcons,
  suitOrder,
  titleize,
} from '#/lib/tarot'

function mapElement(element: typeof elements.$inferSelect | null | undefined) {
  if (!element) return null

  return {
    id: element.id,
    name: element.name,
    symbol: element.symbol,
  }
}

function mapSephira(sephira: typeof sephiroth.$inferSelect | null | undefined) {
  if (!sephira) return null

  return {
    id: sephira.id,
    number: sephira.number,
    name: sephira.name,
    meaning: sephira.meaning,
  }
}

function mapPlanet(planet: typeof planets.$inferSelect | null | undefined) {
  if (!planet) return null

  return {
    id: planet.id,
    name: planet.name,
    symbol: planet.symbol,
  }
}

function mapPrinciple(
  principle: typeof alchemicalPrinciples.$inferSelect | null | undefined,
) {
  if (!principle) return null

  return {
    id: principle.id,
    name: principle.name,
    symbol: principle.symbol,
    guna: principle.guna,
    nature: principle.nature,
  }
}

function mapZodiacSign(
  sign:
    | (typeof zodiacSigns.$inferSelect & {
        element?: typeof elements.$inferSelect | null
      })
    | null
    | undefined,
) {
  if (!sign) return null

  return {
    id: sign.id,
    name: sign.name,
    symbol: sign.symbol,
    modality: sign.modality,
    element: mapElement(sign.element),
  }
}

function mapHebrewLetter(
  letter: typeof hebrewLetters.$inferSelect | null | undefined,
) {
  if (!letter) return null

  return {
    id: letter.id,
    name: letter.name,
    letter: letter.letter,
    meaning: letter.meaning,
    number: letter.number,
    letterType: letter.letterType,
  }
}

function mapPath(
  path:
    | (typeof paths.$inferSelect & {
        startSephira?: typeof sephiroth.$inferSelect | null
        endSephira?: typeof sephiroth.$inferSelect | null
        hebrewLetter?: typeof hebrewLetters.$inferSelect | null
      })
    | null
    | undefined,
) {
  if (!path) return null

  return {
    id: path.id,
    number: path.number,
    startSephira: mapSephira(path.startSephira),
    endSephira: mapSephira(path.endSephira),
    hebrewLetter: mapHebrewLetter(path.hebrewLetter),
  }
}

function mapCardSummary(
  card:
    | (typeof cards.$inferSelect & {
        sephira?: typeof sephiroth.$inferSelect | null
        path?: (typeof paths.$inferSelect & {
          startSephira?: typeof sephiroth.$inferSelect | null
          endSephira?: typeof sephiroth.$inferSelect | null
          hebrewLetter?: typeof hebrewLetters.$inferSelect | null
        }) | null
        zodiacSign?: (typeof zodiacSigns.$inferSelect & {
          element?: typeof elements.$inferSelect | null
        }) | null
        planet?: typeof planets.$inferSelect | null
        element?: typeof elements.$inferSelect | null
        alchemicalPrinciple?: typeof alchemicalPrinciples.$inferSelect | null
      })
    | null
    | undefined,
) {
  if (!card) return null

  return {
    id: card.id,
    name: card.name,
    arcana: card.arcana as 'major' | 'minor',
    suit: (card.suit ?? null) as keyof typeof suitIcons | null,
    rank: card.rank,
    atuNumber: card.atuNumber,
    imageUrl: getCardImageUrl(card.imagePath),
    thumbUrl: getCardThumbUrl(card.imagePath),
    badge:
      card.arcana === 'major'
        ? `ATU ${card.atuNumber}`
        : `${suitIcons[card.suit as keyof typeof suitIcons]} ${titleize(card.suit)}`,
    typeLabel:
      card.arcana === 'major'
        ? 'Major Arcana'
        : `Minor Arcana · ${titleize(card.suit)}`,
    sephira: mapSephira(card.sephira),
    path: mapPath(card.path),
    zodiacSign: mapZodiacSign(card.zodiacSign),
    planet: mapPlanet(card.planet),
    element: mapElement(card.element),
    alchemicalPrinciple: mapPrinciple(card.alchemicalPrinciple),
    alchemicalWedding: card.alchemicalWedding,
  }
}

function sortCards<T extends { arcana: string; atuNumber: number | null; suit: string | null; rank: string | null; id: number }>(
  deck: T[],
) {
  return [...deck].sort((left, right) => {
    if (left.arcana !== right.arcana) {
      return left.arcana === 'major' ? -1 : 1
    }

    if (left.arcana === 'major') {
      return (left.atuNumber ?? 0) - (right.atuNumber ?? 0)
    }

    const suitDelta =
      suitOrder[left.suit as keyof typeof suitOrder] -
      suitOrder[right.suit as keyof typeof suitOrder]
    if (suitDelta !== 0) {
      return suitDelta
    }

    const rankDelta =
      (rankOrder[left.rank ?? ''] ?? 999) - (rankOrder[right.rank ?? ''] ?? 999)
    if (rankDelta !== 0) {
      return rankDelta
    }

    return left.id - right.id
  })
}

async function getAllCardsWithRelations() {
  return db.query.cards.findMany({
    with: {
      sephira: true,
      path: {
        with: {
          startSephira: true,
          endSephira: true,
          hebrewLetter: true,
        },
      },
      zodiacSign: {
        with: {
          element: true,
        },
      },
      planet: true,
      element: true,
      alchemicalPrinciple: true,
    },
  })
}

function getBirthdayCards(dateOfBirth: string, allCards: Awaited<ReturnType<typeof getAllCardsWithRelations>>) {
  const profile = getBirthdayProfile(dateOfBirth)
  const byAtu = new Map(
    allCards
      .filter((card) => card.atuNumber !== null)
      .map((card) => [card.atuNumber as number, card]),
  )
  const bySuitRank = new Map(
    allCards
      .filter((card) => card.suit && card.rank)
      .map((card) => [`${card.suit}:${card.rank}`, card]),
  )

  return {
    sunSign: profile.sunSign,
    element: titleize(profile.element),
    sunSignCard: mapCardSummary(byAtu.get(profile.sunSignAtu)),
    planetaryRulerCard: mapCardSummary(byAtu.get(profile.planetaryRulerAtu)),
    decanCard: mapCardSummary(
      profile.decan
        ? bySuitRank.get(`${profile.decan.suit}:${profile.decan.rank}`)
        : null,
    ),
    courtCard: mapCardSummary(
      profile.court
        ? bySuitRank.get(`${profile.court.suit}:${profile.court.rank}`)
        : null,
    ),
    elementalAce: mapCardSummary(
      bySuitRank.get(`${profile.elementalAce.suit}:${profile.elementalAce.rank}`),
    ),
  }
}

export async function getCardsPageData(filter: {
  arcana?: 'major' | 'minor'
  suit?: keyof typeof suitIcons
}) {
  const clauses = []

  if (filter.arcana) {
    clauses.push(eq(cards.arcana, filter.arcana))
  }

  if (filter.suit) {
    clauses.push(eq(cards.suit, filter.suit))
  }

  const deck = await db.query.cards.findMany({
    where: clauses.length === 0 ? undefined : clauses.length === 1 ? clauses[0] : and(...clauses),
  })

  return {
    cards: sortCards(deck)
      .map((card) => mapCardSummary(card))
      .filter(Boolean),
  }
}

export async function getCardDetail(cardId: number) {
  const card = await db.query.cards.findFirst({
    where: eq(cards.id, cardId),
    with: {
      sephira: true,
      path: {
        with: {
          startSephira: true,
          endSephira: true,
          hebrewLetter: true,
        },
      },
      zodiacSign: {
        with: {
          element: true,
        },
      },
      planet: true,
      element: true,
      alchemicalPrinciple: true,
    },
  })

  if (!card) return null

  return {
    card: mapCardSummary(card),
  }
}

export async function getSephirothListData() {
  const nodes = await db.query.sephiroth.findMany({
    with: {
      cards: true,
    },
  })

  return {
    sephiroth: [...nodes]
      .sort((left, right) => left.number - right.number)
      .map((node) => ({
        ...mapSephira(node)!,
        cardCount: node.cards.length,
      })),
  }
}

export async function getSephiraDetail(sephiraId: number) {
  const node = await db.query.sephiroth.findFirst({
    where: eq(sephiroth.id, sephiraId),
    with: {
      cards: {
        with: {
          zodiacSign: {
            with: {
              element: true,
            },
          },
        },
      },
      outgoingPaths: {
        with: {
          startSephira: true,
          endSephira: true,
          card: true,
          hebrewLetter: true,
        },
      },
      incomingPaths: {
        with: {
          startSephira: true,
          endSephira: true,
          card: true,
          hebrewLetter: true,
        },
      },
    },
  })

  if (!node) return null

  const connectedPaths = [...node.outgoingPaths, ...node.incomingPaths].sort(
    (left, right) => left.number - right.number,
  )

  return {
    sephira: mapSephira(node),
    cards: sortCards(node.cards).map((card) => mapCardSummary(card)).filter(Boolean),
    paths: connectedPaths.map((path) => ({
      ...mapPath(path)!,
      card: mapCardSummary(path.card),
    })),
  }
}

export async function getPathsListData() {
  const entries = await db.query.paths.findMany({
    with: {
      startSephira: true,
      endSephira: true,
      hebrewLetter: true,
      card: true,
    },
  })

  return {
    paths: [...entries]
      .sort((left, right) => left.number - right.number)
      .map((path) => ({
        ...mapPath(path)!,
        card: mapCardSummary(path.card),
      })),
  }
}

export async function getPathDetail(pathId: number) {
  const entry = await db.query.paths.findFirst({
    where: eq(paths.id, pathId),
    with: {
      startSephira: true,
      endSephira: true,
      hebrewLetter: true,
      card: true,
    },
  })

  if (!entry) return null

  return {
    path: {
      ...mapPath(entry)!,
      card: mapCardSummary(entry.card),
    },
  }
}

export async function getZodiacListData() {
  const signs = await db.query.zodiacSigns.findMany({
    with: {
      cards: true,
      element: true,
    },
  })

  return {
    zodiacSigns: [...signs]
      .sort((left, right) => left.name.localeCompare(right.name))
      .map((sign) => ({
        ...mapZodiacSign(sign)!,
        cardCount: sign.cards.length,
      })),
  }
}

export async function getZodiacDetail(signId: number) {
  const sign = await db.query.zodiacSigns.findFirst({
    where: eq(zodiacSigns.id, signId),
    with: {
      element: true,
      cards: {
        with: {
          sephira: true,
          path: {
            with: {
              startSephira: true,
              endSephira: true,
              hebrewLetter: true,
            },
          },
        },
      },
    },
  })

  if (!sign) return null

  return {
    zodiacSign: mapZodiacSign(sign),
    cards: sortCards(sign.cards).map((card) => mapCardSummary(card)).filter(Boolean),
  }
}

export async function getPlanetsListData() {
  const bodies = await db.query.planets.findMany({
    with: {
      cards: true,
    },
  })

  return {
    planets: [...bodies]
      .sort((left, right) => left.name.localeCompare(right.name))
      .map((planet) => ({
        ...mapPlanet(planet)!,
        cardCount: planet.cards.length,
      })),
  }
}

export async function getPlanetDetail(planetId: number) {
  const planet = await db.query.planets.findFirst({
    where: eq(planets.id, planetId),
    with: {
      cards: {
        with: {
          sephira: true,
          path: {
            with: {
              startSephira: true,
              endSephira: true,
              hebrewLetter: true,
            },
          },
          zodiacSign: {
            with: {
              element: true,
            },
          },
        },
      },
    },
  })

  if (!planet) return null

  return {
    planet: mapPlanet(planet),
    cards: sortCards(planet.cards).map((card) => mapCardSummary(card)).filter(Boolean),
  }
}

export async function getElementsListData() {
  const rows = await db.query.elements.findMany({
    with: {
      cards: true,
      zodiacSigns: true,
    },
  })

  return {
    elements: [...rows]
      .sort((left, right) => left.name.localeCompare(right.name))
      .map((element) => ({
        ...mapElement(element)!,
        zodiacSigns: element.zodiacSigns
          .map((sign) => sign.name)
          .sort((left, right) => left.localeCompare(right)),
        cardCount: element.cards.length,
      })),
  }
}

export async function getElementDetail(elementId: number) {
  const element = await db.query.elements.findFirst({
    where: eq(elements.id, elementId),
    with: {
      zodiacSigns: true,
      cards: {
        with: {
          sephira: true,
          path: {
            with: {
              startSephira: true,
              endSephira: true,
              hebrewLetter: true,
            },
          },
          zodiacSign: {
            with: {
              element: true,
            },
          },
        },
      },
    },
  })

  if (!element) return null

  return {
    element: {
      ...mapElement(element)!,
      zodiacSigns: element.zodiacSigns
        .map((sign) => mapZodiacSign(sign))
        .filter(Boolean),
    },
    cards: sortCards(element.cards).map((card) => mapCardSummary(card)).filter(Boolean),
  }
}

export async function getHebrewLettersListData() {
  const letters = await db.query.hebrewLetters.findMany({
    with: {
      path: {
        with: {
          card: true,
          startSephira: true,
          endSephira: true,
          hebrewLetter: true,
        },
      },
    },
  })

  return {
    letters: [...letters]
      .sort((left, right) => left.number - right.number)
      .map((letter) => ({
        ...mapHebrewLetter(letter)!,
        path: letter.path
          ? {
              ...mapPath(letter.path)!,
              card: mapCardSummary(letter.path.card),
            }
          : null,
      })),
  }
}

export async function getHebrewLetterDetail(letterId: number) {
  const letter = await db.query.hebrewLetters.findFirst({
    where: eq(hebrewLetters.id, letterId),
    with: {
      path: {
        with: {
          card: true,
          startSephira: true,
          endSephira: true,
          hebrewLetter: true,
        },
      },
    },
  })

  if (!letter) return null

  return {
    letter: {
      ...mapHebrewLetter(letter)!,
      path: letter.path
        ? {
            ...mapPath(letter.path)!,
            card: mapCardSummary(letter.path.card),
          }
        : null,
    },
  }
}

export async function getAlchemyListData() {
  const principles = await db.query.alchemicalPrinciples.findMany({
    with: {
      cards: true,
    },
  })
  const weddingCards = await db.query.cards.findMany({
    where: and(eq(cards.arcana, 'major')),
  })

  return {
    principles: [...principles]
      .sort((left, right) => left.name.localeCompare(right.name))
      .map((principle) => ({
        ...mapPrinciple(principle)!,
        cardCount: principle.cards.length,
      })),
    weddingCards: sortCards(
      weddingCards.filter((card) => card.alchemicalWedding),
    )
      .map((card) => mapCardSummary(card))
      .filter(Boolean),
  }
}

export async function getAlchemyDetail(principleId: number) {
  const principle = await db.query.alchemicalPrinciples.findFirst({
    where: eq(alchemicalPrinciples.id, principleId),
    with: {
      cards: {
        with: {
          sephira: true,
          path: {
            with: {
              startSephira: true,
              endSephira: true,
              hebrewLetter: true,
            },
          },
          zodiacSign: {
            with: {
              element: true,
            },
          },
          planet: true,
          element: true,
          alchemicalPrinciple: true,
        },
      },
    },
  })

  if (!principle) return null

  return {
    principle: mapPrinciple(principle),
    cards: sortCards(principle.cards).map((card) => mapCardSummary(card)).filter(Boolean),
  }
}

export async function getTreePageData() {
  const [nodes, edgeList] = await Promise.all([
    db.query.sephiroth.findMany({
      with: {
        cards: true,
      },
    }),
    db.query.paths.findMany({
      with: {
        startSephira: true,
        endSephira: true,
        hebrewLetter: true,
        card: true,
      },
    }),
  ])

  return {
    sephiroth: [...nodes]
      .sort((left, right) => left.number - right.number)
      .map((node) => ({
        ...mapSephira(node)!,
        cards: sortCards(node.cards).map((card) => mapCardSummary(card)).filter(Boolean),
      })),
    paths: [...edgeList]
      .sort((left, right) => left.number - right.number)
      .map((path) => ({
        ...mapPath(path)!,
        card: mapCardSummary(path.card),
      })),
  }
}

export async function getProfilePageData(userId: number) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  })

  if (!user) {
    return null
  }

  const deck = await getAllCardsWithRelations()
  const profile = getBirthdayCards(user.dateOfBirth, deck)

  return {
    user: {
      id: user.id,
      emailAddress: user.emailAddress,
      dateOfBirth: user.dateOfBirth,
      formattedDateOfBirth: formatLongDate(user.dateOfBirth),
    },
    profile,
  }
}

export async function getReadingsIndexData(userId: number) {
  const rows = await db.query.readings.findMany({
    where: eq(readings.userId, userId),
    with: {
      spread: true,
      significatorCard: true,
    },
  })

  return {
    readings: [...rows]
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
      .map((reading) => ({
        id: reading.id,
        name: reading.name,
        createdAt: reading.createdAt,
        spread: {
          id: reading.spread.id,
          name: reading.spread.name,
        },
        significatorCard: mapCardSummary(reading.significatorCard),
      })),
  }
}

export async function getReadingBuilderData(userId: number, spreadId?: number) {
  const [user, allSpreads, deck] = await Promise.all([
    db.query.users.findFirst({ where: eq(users.id, userId) }),
    db.query.spreads.findMany({
      with: {
        positions: true,
      },
    }),
    getAllCardsWithRelations(),
  ])

  if (!user) {
    return null
  }

  const birthdayCards = getBirthdayCards(user.dateOfBirth, deck)
  const spreadsList = [...allSpreads]
    .sort((left, right) => left.id - right.id)
    .map((spread) => ({
      id: spread.id,
      name: spread.name,
      description: spread.description,
      positions: [...spread.positions].sort((left, right) => left.number - right.number),
    }))

  if (!spreadId) {
    return {
      mode: 'choose' as const,
      spreads: spreadsList,
    }
  }

  const spread = spreadsList.find((entry) => entry.id === spreadId)
  if (!spread) {
    return null
  }

  return {
    mode: 'build' as const,
    spread,
    allCards: sortCards(deck).map((card) => mapCardSummary(card)).filter(Boolean),
    significatorCard: birthdayCards.courtCard,
  }
}

export async function createReadingForUser(input: {
  userId: number
  spreadId: number
  name?: string
  significatorCardId?: number | null
  positionCards: Array<{ spreadPositionId: number; cardId: number }>
}) {
  const spread = await db.query.spreads.findFirst({
    where: eq(spreads.id, input.spreadId),
    with: {
      positions: true,
    },
  })

  if (!spread) {
    throw new Error('Spread not found.')
  }

  const validPositionIds = new Set(spread.positions.map((position) => position.id))
  const validCards = input.positionCards.filter((entry) => validPositionIds.has(entry.spreadPositionId))
  const uniqueCardIds = new Set(validCards.map((entry) => entry.cardId))

  if (uniqueCardIds.size !== validCards.length) {
    throw new Error('Each card can only be used once in a reading.')
  }

  const [reading] = await db
    .insert(readings)
    .values({
      userId: input.userId,
      spreadId: input.spreadId,
      name: input.name?.trim() || null,
      significatorCardId: input.significatorCardId ?? null,
    })
    .returning()

  if (validCards.length > 0) {
    await db.insert(readingCards).values(
      validCards.map((entry) => ({
        readingId: reading.id,
        spreadPositionId: entry.spreadPositionId,
        cardId: entry.cardId,
      })),
    )
  }

  return reading
}

export async function getReadingDetail(userId: number, readingId: number) {
  const reading = await db.query.readings.findFirst({
    where: and(eq(readings.id, readingId), eq(readings.userId, userId)),
    with: {
      spread: {
        with: {
          positions: true,
        },
      },
      significatorCard: true,
      readingCards: {
        with: {
          spreadPosition: true,
          card: true,
        },
      },
    },
  })

  if (!reading) {
    return null
  }

  const cardsByPosition = new Map(
    reading.readingCards.map((entry) => [entry.spreadPositionId, entry]),
  )

  return {
    reading: {
      id: reading.id,
      name: reading.name,
      createdAt: reading.createdAt,
      spread: {
        id: reading.spread.id,
        name: reading.spread.name,
        description: reading.spread.description,
      },
      significatorCard: mapCardSummary(reading.significatorCard),
      positions: [...reading.spread.positions]
        .sort((left, right) => left.number - right.number)
        .filter((position) => !position.significator)
        .map((position) => ({
          id: position.id,
          number: position.number,
          name: position.name,
          card: mapCardSummary(cardsByPosition.get(position.id)?.card),
        })),
    },
  }
}
