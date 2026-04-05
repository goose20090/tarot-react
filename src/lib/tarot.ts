export const suitIcons = {
  wands: '🔥',
  cups: '🌊',
  swords: '⚔️',
  disks: '🪙',
} as const

export const elementTones = {
  Fire: 'fire',
  Water: 'water',
  Air: 'air',
  Earth: 'earth',
} as const

export const zodiacSymbols = {
  Aries: '♈',
  Taurus: '♉',
  Gemini: '♊',
  Cancer: '♋',
  Leo: '♌',
  Virgo: '♍',
  Libra: '♎',
  Scorpio: '♏',
  Sagittarius: '♐',
  Capricorn: '♑',
  Aquarius: '♒',
  Pisces: '♓',
} as const

export type Suit = keyof typeof suitIcons
export type Arcana = 'major' | 'minor'

export const suitOrder: Record<Suit, number> = {
  wands: 0,
  cups: 1,
  swords: 2,
  disks: 3,
}

export const rankOrder: Record<string, number> = {
  ace: 0,
  two: 1,
  three: 2,
  four: 3,
  five: 4,
  six: 5,
  seven: 6,
  eight: 7,
  nine: 8,
  ten: 9,
  knight: 10,
  queen: 11,
  prince: 12,
  princess: 13,
}

export function titleize(value: string | null | undefined) {
  if (!value) return ''
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export function getCardThumbUrl(imagePath: string | null | undefined) {
  if (!imagePath) return null
  return `/tarot-assets/card-images-small/${imagePath.replace(/\.\w+$/, '.webp')}`
}

export function getCardImageUrl(imagePath: string | null | undefined) {
  if (!imagePath) return null
  return `/tarot-assets/card-images/${imagePath}`
}

export function formatCardType(arcana: Arcana, suit: string | null | undefined) {
  if (arcana === 'major') return 'Major Arcana'
  return `Minor Arcana · ${titleize(suit)}`
}

export function formatDisplayDate(value: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

export function formatLongDate(value: string) {
  const [year, month, day] = value.split('-').map(Number)
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(Date.UTC(year, month - 1, day)))
}

export function parsePositiveInt(value: string) {
  const parsed = Number.parseInt(value, 10)
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error('Expected a positive integer id.')
  }

  return parsed
}
