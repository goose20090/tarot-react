import { relations, sql } from 'drizzle-orm'
import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'

const createdAt = text('created_at')
  .notNull()
  .default(sql`CURRENT_TIMESTAMP`)

export const alchemicalPrinciples = sqliteTable(
  'alchemical_principles',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    symbol: text('symbol').notNull(),
    guna: text('guna').notNull(),
    nature: text('nature').notNull(),
  },
  (table) => [uniqueIndex('alchemical_principles_name_unique').on(table.name)],
)

export const elements = sqliteTable(
  'elements',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    symbol: text('symbol').notNull(),
  },
  (table) => [uniqueIndex('elements_name_unique').on(table.name)],
)

export const sephiroth = sqliteTable(
  'sephiroth',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    number: integer('number').notNull(),
    name: text('name').notNull(),
    meaning: text('meaning').notNull(),
  },
  (table) => [
    uniqueIndex('sephiroth_number_unique').on(table.number),
    uniqueIndex('sephiroth_name_unique').on(table.name),
  ],
)

export const zodiacSigns = sqliteTable(
  'zodiac_signs',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    modality: text('modality').notNull(),
    symbol: text('symbol').notNull(),
    elementId: integer('element_id').references(() => elements.id),
  },
  (table) => [uniqueIndex('zodiac_signs_name_unique').on(table.name)],
)

export const planets = sqliteTable(
  'planets',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    symbol: text('symbol').notNull(),
  },
  (table) => [uniqueIndex('planets_name_unique').on(table.name)],
)

export const hebrewLetters = sqliteTable(
  'hebrew_letters',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    letter: text('letter').notNull(),
    meaning: text('meaning').notNull(),
    number: integer('number').notNull(),
    letterType: text('letter_type').notNull(),
  },
  (table) => [
    uniqueIndex('hebrew_letters_name_unique').on(table.name),
    uniqueIndex('hebrew_letters_number_unique').on(table.number),
  ],
)

export const paths = sqliteTable(
  'paths',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    number: integer('number').notNull(),
    startSephiraId: integer('start_sephira_id')
      .notNull()
      .references(() => sephiroth.id),
    endSephiraId: integer('end_sephira_id')
      .notNull()
      .references(() => sephiroth.id),
    hebrewLetterId: integer('hebrew_letter_id').references(() => hebrewLetters.id),
  },
  (table) => [
    uniqueIndex('paths_number_unique').on(table.number),
    uniqueIndex('paths_hebrew_letter_unique').on(table.hebrewLetterId),
  ],
)

export const cards = sqliteTable(
  'cards',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    arcana: text('arcana').notNull(),
    suit: text('suit'),
    rank: text('rank'),
    atuNumber: integer('atu_number'),
    imagePath: text('image_path').notNull(),
    sephiraId: integer('sephira_id').references(() => sephiroth.id),
    pathId: integer('path_id').references(() => paths.id),
    zodiacSignId: integer('zodiac_sign_id').references(() => zodiacSigns.id),
    planetId: integer('planet_id').references(() => planets.id),
    elementId: integer('element_id').references(() => elements.id),
    alchemicalPrincipleId: integer('alchemical_principle_id').references(
      () => alchemicalPrinciples.id,
    ),
    alchemicalWedding: text('alchemical_wedding'),
  },
  (table) => [
    uniqueIndex('cards_name_unique').on(table.name),
    uniqueIndex('cards_atu_number_unique').on(table.atuNumber),
    uniqueIndex('cards_path_unique').on(table.pathId),
  ],
)

export const spreads = sqliteTable(
  'spreads',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    description: text('description').notNull(),
  },
  (table) => [uniqueIndex('spreads_name_unique').on(table.name)],
)

export const spreadPositions = sqliteTable(
  'spread_positions',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    spreadId: integer('spread_id')
      .notNull()
      .references(() => spreads.id),
    number: integer('number').notNull(),
    name: text('name'),
    significator: integer('significator', { mode: 'boolean' })
      .notNull()
      .default(false),
  },
  (table) => [uniqueIndex('spread_positions_spread_number_unique').on(table.spreadId, table.number)],
)

export const users = sqliteTable(
  'users',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    emailAddress: text('email_address').notNull(),
    passwordHash: text('password_hash').notNull(),
    dateOfBirth: text('date_of_birth').notNull(),
    createdAt,
  },
  (table) => [uniqueIndex('users_email_address_unique').on(table.emailAddress)],
)

export const readings = sqliteTable('readings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  spreadId: integer('spread_id')
    .notNull()
    .references(() => spreads.id),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  name: text('name'),
  notes: text('notes'),
  significatorCardId: integer('significator_card_id').references(() => cards.id),
  createdAt,
})

export const readingCards = sqliteTable(
  'reading_cards',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    readingId: integer('reading_id')
      .notNull()
      .references(() => readings.id),
    spreadPositionId: integer('spread_position_id')
      .notNull()
      .references(() => spreadPositions.id),
    cardId: integer('card_id')
      .notNull()
      .references(() => cards.id),
  },
  (table) => [uniqueIndex('reading_cards_reading_position_unique').on(table.readingId, table.spreadPositionId)],
)

export const alchemicalPrinciplesRelations = relations(
  alchemicalPrinciples,
  ({ many }) => ({
    cards: many(cards),
  }),
)

export const elementsRelations = relations(elements, ({ many }) => ({
  cards: many(cards),
  zodiacSigns: many(zodiacSigns),
}))

export const sephirothRelations = relations(sephiroth, ({ many }) => ({
  cards: many(cards),
  outgoingPaths: many(paths, { relationName: 'startSephira' }),
  incomingPaths: many(paths, { relationName: 'endSephira' }),
}))

export const zodiacSignsRelations = relations(zodiacSigns, ({ one, many }) => ({
  element: one(elements, {
    fields: [zodiacSigns.elementId],
    references: [elements.id],
  }),
  cards: many(cards),
}))

export const planetsRelations = relations(planets, ({ many }) => ({
  cards: many(cards),
}))

export const hebrewLettersRelations = relations(hebrewLetters, ({ one }) => ({
  path: one(paths, {
    fields: [hebrewLetters.id],
    references: [paths.hebrewLetterId],
  }),
}))

export const pathsRelations = relations(paths, ({ one }) => ({
  startSephira: one(sephiroth, {
    relationName: 'startSephira',
    fields: [paths.startSephiraId],
    references: [sephiroth.id],
  }),
  endSephira: one(sephiroth, {
    relationName: 'endSephira',
    fields: [paths.endSephiraId],
    references: [sephiroth.id],
  }),
  hebrewLetter: one(hebrewLetters, {
    fields: [paths.hebrewLetterId],
    references: [hebrewLetters.id],
  }),
  card: one(cards, {
    fields: [paths.id],
    references: [cards.pathId],
  }),
}))

export const cardsRelations = relations(cards, ({ one, many }) => ({
  sephira: one(sephiroth, {
    fields: [cards.sephiraId],
    references: [sephiroth.id],
  }),
  path: one(paths, {
    fields: [cards.pathId],
    references: [paths.id],
  }),
  zodiacSign: one(zodiacSigns, {
    fields: [cards.zodiacSignId],
    references: [zodiacSigns.id],
  }),
  planet: one(planets, {
    fields: [cards.planetId],
    references: [planets.id],
  }),
  element: one(elements, {
    fields: [cards.elementId],
    references: [elements.id],
  }),
  alchemicalPrinciple: one(alchemicalPrinciples, {
    fields: [cards.alchemicalPrincipleId],
    references: [alchemicalPrinciples.id],
  }),
  readingCards: many(readingCards),
}))

export const spreadsRelations = relations(spreads, ({ many }) => ({
  positions: many(spreadPositions),
  readings: many(readings),
}))

export const spreadPositionsRelations = relations(spreadPositions, ({ one, many }) => ({
  spread: one(spreads, {
    fields: [spreadPositions.spreadId],
    references: [spreads.id],
  }),
  readingCards: many(readingCards),
}))

export const usersRelations = relations(users, ({ many }) => ({
  readings: many(readings),
}))

export const readingsRelations = relations(readings, ({ one, many }) => ({
  spread: one(spreads, {
    fields: [readings.spreadId],
    references: [spreads.id],
  }),
  user: one(users, {
    fields: [readings.userId],
    references: [users.id],
  }),
  significatorCard: one(cards, {
    fields: [readings.significatorCardId],
    references: [cards.id],
  }),
  readingCards: many(readingCards),
}))

export const readingCardsRelations = relations(readingCards, ({ one }) => ({
  reading: one(readings, {
    fields: [readingCards.readingId],
    references: [readings.id],
  }),
  spreadPosition: one(spreadPositions, {
    fields: [readingCards.spreadPositionId],
    references: [spreadPositions.id],
  }),
  card: one(cards, {
    fields: [readingCards.cardId],
    references: [cards.id],
  }),
}))

export type DatabaseSchema = typeof import('./schema')
