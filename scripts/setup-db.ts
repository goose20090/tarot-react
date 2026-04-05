import { existsSync, mkdirSync, readFileSync, rmSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { eq } from 'drizzle-orm'
import {
  alchemicalPrinciplesSeed,
  elementsSeed,
  hebrewLettersSeed,
  pathsSeed,
  planetsSeed,
  sephirothSeed,
  spreadsSeed,
  zodiacSeed,
} from '../src/db/seed-data'
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
} from '../src/db/schema'

const appRoot = resolve(import.meta.dirname, '..')
const databasePath = resolve(appRoot, 'data/tarot.sqlite')
const cardsCsvPath = resolve(appRoot, 'data/cards.csv')
const force = process.argv.includes('--force')

function ensureDir(path: string) {
  mkdirSync(path, { recursive: true })
}

function parseCsv(text: string) {
  const rows: Array<Record<string, string>> = []
  const lines: string[][] = []
  let field = ''
  let row: string[] = []
  let inQuotes = false

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index]
    const next = text[index + 1]

    if (char === '"') {
      if (inQuotes && next === '"') {
        field += '"'
        index += 1
      } else {
        inQuotes = !inQuotes
      }
      continue
    }

    if (char === ',' && !inQuotes) {
      row.push(field)
      field = ''
      continue
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') {
        index += 1
      }
      row.push(field)
      if (row.some((value) => value.length > 0)) {
        lines.push(row)
      }
      field = ''
      row = []
      continue
    }

    field += char
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field)
    lines.push(row)
  }

  const [headers, ...records] = lines
  if (!headers) {
    return rows
  }

  for (const values of records) {
    const record: Record<string, string> = {}
    headers.forEach((header, index) => {
      record[header] = values[index] ?? ''
    })
    rows.push(record)
  }

  return rows
}

function createTables(sqlite: Database.Database) {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS alchemical_principles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      symbol TEXT NOT NULL,
      guna TEXT NOT NULL,
      nature TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS elements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      symbol TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sephiroth (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      number INTEGER NOT NULL UNIQUE,
      name TEXT NOT NULL UNIQUE,
      meaning TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS zodiac_signs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      modality TEXT NOT NULL,
      symbol TEXT NOT NULL,
      element_id INTEGER REFERENCES elements(id)
    );

    CREATE TABLE IF NOT EXISTS planets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      symbol TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS hebrew_letters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      letter TEXT NOT NULL,
      meaning TEXT NOT NULL,
      number INTEGER NOT NULL UNIQUE,
      letter_type TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS paths (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      number INTEGER NOT NULL UNIQUE,
      start_sephira_id INTEGER NOT NULL REFERENCES sephiroth(id),
      end_sephira_id INTEGER NOT NULL REFERENCES sephiroth(id),
      hebrew_letter_id INTEGER UNIQUE REFERENCES hebrew_letters(id)
    );

    CREATE TABLE IF NOT EXISTS cards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      arcana TEXT NOT NULL,
      suit TEXT,
      rank TEXT,
      atu_number INTEGER UNIQUE,
      image_path TEXT NOT NULL,
      sephira_id INTEGER REFERENCES sephiroth(id),
      path_id INTEGER UNIQUE REFERENCES paths(id),
      zodiac_sign_id INTEGER REFERENCES zodiac_signs(id),
      planet_id INTEGER REFERENCES planets(id),
      element_id INTEGER REFERENCES elements(id),
      alchemical_principle_id INTEGER REFERENCES alchemical_principles(id),
      alchemical_wedding TEXT
    );

    CREATE TABLE IF NOT EXISTS spreads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      description TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS spread_positions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      spread_id INTEGER NOT NULL REFERENCES spreads(id),
      number INTEGER NOT NULL,
      name TEXT,
      significator INTEGER NOT NULL DEFAULT 0
    );

    CREATE UNIQUE INDEX IF NOT EXISTS spread_positions_spread_number_unique
      ON spread_positions (spread_id, number);

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email_address TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      date_of_birth TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS readings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      spread_id INTEGER NOT NULL REFERENCES spreads(id),
      user_id INTEGER NOT NULL REFERENCES users(id),
      name TEXT,
      notes TEXT,
      significator_card_id INTEGER REFERENCES cards(id),
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS reading_cards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reading_id INTEGER NOT NULL REFERENCES readings(id),
      spread_position_id INTEGER NOT NULL REFERENCES spread_positions(id),
      card_id INTEGER NOT NULL REFERENCES cards(id)
    );

    CREATE UNIQUE INDEX IF NOT EXISTS reading_cards_reading_position_unique
      ON reading_cards (reading_id, spread_position_id);
  `)
}

async function main() {
  if (force && existsSync(databasePath)) {
    rmSync(databasePath)
  }

  ensureDir(dirname(databasePath))
  const sqlite = new Database(databasePath)
  sqlite.pragma('foreign_keys = ON')
  createTables(sqlite)

  const db = drizzle(sqlite, {
    schema: {
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
    },
  })

  await db.insert(alchemicalPrinciples).values(alchemicalPrinciplesSeed).onConflictDoNothing()
  await db.insert(elements).values(elementsSeed).onConflictDoNothing()
  await db.insert(sephiroth).values(sephirothSeed).onConflictDoNothing()
  await db.insert(planets).values(planetsSeed).onConflictDoNothing()
  await db
    .insert(hebrewLetters)
    .values(
      hebrewLettersSeed.map(({ pathNumber: _pathNumber, ...letter }) => letter),
    )
    .onConflictDoNothing()

  const elementRows = await db.query.elements.findMany()
  const elementMap = new Map(elementRows.map((row) => [row.name, row.id]))
  await db
    .insert(zodiacSigns)
    .values(
      zodiacSeed.map((sign) => ({
        name: sign.name,
        modality: sign.modality,
        symbol: sign.symbol,
        elementId: elementMap.get(sign.element) ?? null,
      })),
    )
    .onConflictDoNothing()

  const letterRows = await db.query.hebrewLetters.findMany()
  const letterMap = new Map(
    hebrewLettersSeed.map((entry) => [
      entry.pathNumber,
      letterRows.find((row) => row.name === entry.name)?.id ?? null,
    ]),
  )
  const sephiraRows = await db.query.sephiroth.findMany()
  const sephiraMap = new Map(sephiraRows.map((row) => [row.number, row.id]))

  await db
    .insert(paths)
    .values(
      pathsSeed.map((path) => ({
        number: path.number,
        startSephiraId: sephiraMap.get(path.start)!,
        endSephiraId: sephiraMap.get(path.end)!,
        hebrewLetterId: letterMap.get(path.number) ?? null,
      })),
    )
    .onConflictDoNothing()

  const principleRows = await db.query.alchemicalPrinciples.findMany()
  const principleMap = new Map(principleRows.map((row) => [row.name, row.id]))
  const zodiacRows = await db.query.zodiacSigns.findMany()
  const zodiacMap = new Map(zodiacRows.map((row) => [row.name, row.id]))
  const planetRows = await db.query.planets.findMany()
  const planetMap = new Map(planetRows.map((row) => [row.name, row.id]))
  const pathRows = await db.query.paths.findMany()
  const pathMap = new Map(pathRows.map((row) => [row.number, row.id]))

  if (!existsSync(cardsCsvPath)) {
    throw new Error(`Missing local seed file: ${cardsCsvPath}`)
  }

  const csvRows = parseCsv(readFileSync(cardsCsvPath, 'utf8'))
  await db
    .insert(cards)
    .values(
      csvRows.map((row) => ({
        name: row.name,
        arcana: row.type === 'MajorArcanum' ? 'major' : 'minor',
        suit: row.suit || null,
        rank: row.rank || null,
        atuNumber: row.atu_number ? Number(row.atu_number) : null,
        imagePath: row.image_url,
        sephiraId: row.sephira_number ? sephiraMap.get(Number(row.sephira_number)) ?? null : null,
        pathId: row.path_number ? pathMap.get(Number(row.path_number)) ?? null : null,
        zodiacSignId: row.zodiac_sign ? zodiacMap.get(row.zodiac_sign) ?? null : null,
        planetId: row.planet ? planetMap.get(row.planet) ?? null : null,
        elementId: row.element ? elementMap.get(row.element) ?? null : null,
        alchemicalPrincipleId: row.alchemical_principle
          ? principleMap.get(row.alchemical_principle) ?? null
          : null,
        alchemicalWedding: row.alchemical_wedding || null,
      })),
    )
    .onConflictDoNothing()

  await db
    .insert(spreads)
    .values(spreadsSeed.map((spread) => ({ name: spread.name, description: spread.description })))
    .onConflictDoNothing()

  const spreadRows = await db.query.spreads.findMany()
  for (const spread of spreadsSeed) {
    const spreadRow = spreadRows.find((row) => row.name === spread.name)
    if (!spreadRow) continue

    const existingPositions = await db.query.spreadPositions.findMany({
      where: eq(spreadPositions.spreadId, spreadRow.id),
    })

    if (existingPositions.length > 0 && !force) {
      continue
    }

    for (const position of spread.positions) {
      await db
        .insert(spreadPositions)
        .values({
          spreadId: spreadRow.id,
          number: position.number,
          name: position.name,
          significator: position.significator,
        })
        .onConflictDoNothing()
    }
  }

  const counts = {
    cards: (sqlite.prepare('SELECT COUNT(*) AS count FROM cards').get() as { count: number }).count,
    paths: (sqlite.prepare('SELECT COUNT(*) AS count FROM paths').get() as { count: number }).count,
    spreads: (sqlite.prepare('SELECT COUNT(*) AS count FROM spreads').get() as { count: number }).count,
    users: (sqlite.prepare('SELECT COUNT(*) AS count FROM users').get() as { count: number }).count,
  }

  sqlite.close()

  console.log('Tarot database ready.')
  console.log(`Cards: ${counts.cards}`)
  console.log(`Paths: ${counts.paths}`)
  console.log(`Spreads: ${counts.spreads}`)
  console.log(`Users: ${counts.users}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
