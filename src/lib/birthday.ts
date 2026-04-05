import type { Suit } from './tarot'

type SignKey =
  | 'aries'
  | 'taurus'
  | 'gemini'
  | 'cancer'
  | 'leo'
  | 'virgo'
  | 'libra'
  | 'scorpio'
  | 'sagittarius'
  | 'capricorn'
  | 'aquarius'
  | 'pisces'

const signRanges: Array<[SignKey, number, number]> = [
  ['aries', 321, 419],
  ['taurus', 420, 520],
  ['gemini', 521, 620],
  ['cancer', 621, 722],
  ['leo', 723, 822],
  ['virgo', 823, 922],
  ['libra', 923, 1022],
  ['scorpio', 1023, 1121],
  ['sagittarius', 1122, 1221],
  ['capricorn', 1222, 119],
  ['aquarius', 120, 218],
  ['pisces', 219, 320],
]

const signAtuMap: Record<SignKey, number> = {
  aries: 4,
  taurus: 5,
  gemini: 6,
  cancer: 7,
  leo: 11,
  virgo: 9,
  libra: 8,
  scorpio: 13,
  sagittarius: 14,
  capricorn: 15,
  aquarius: 17,
  pisces: 18,
}

const planetaryRulerMap: Record<SignKey, number> = {
  leo: 19,
  cancer: 2,
  gemini: 1,
  virgo: 1,
  taurus: 3,
  libra: 3,
  aries: 16,
  scorpio: 16,
  sagittarius: 10,
  pisces: 10,
  capricorn: 21,
  aquarius: 21,
}

const signElements: Record<SignKey, keyof typeof elementSuit> = {
  aries: 'fire',
  leo: 'fire',
  sagittarius: 'fire',
  taurus: 'earth',
  virgo: 'earth',
  capricorn: 'earth',
  gemini: 'air',
  libra: 'air',
  aquarius: 'air',
  cancer: 'water',
  scorpio: 'water',
  pisces: 'water',
}

const elementSuit = {
  fire: 'wands',
  earth: 'disks',
  air: 'swords',
  water: 'cups',
} as const satisfies Record<string, Suit>

const courtTable = [
  { from: 311, to: 410, suit: 'wands', rank: 'queen' },
  { from: 411, to: 510, suit: 'disks', rank: 'prince' },
  { from: 511, to: 610, suit: 'swords', rank: 'knight' },
  { from: 611, to: 711, suit: 'cups', rank: 'queen' },
  { from: 712, to: 811, suit: 'wands', rank: 'prince' },
  { from: 812, to: 911, suit: 'disks', rank: 'knight' },
  { from: 912, to: 1012, suit: 'swords', rank: 'queen' },
  { from: 1013, to: 1112, suit: 'cups', rank: 'prince' },
  { from: 1113, to: 1212, suit: 'wands', rank: 'knight' },
  { from: 1213, to: 109, suit: 'disks', rank: 'queen' },
  { from: 110, to: 208, suit: 'swords', rank: 'prince' },
  { from: 209, to: 310, suit: 'cups', rank: 'knight' },
] as const

const decanTable = [
  { from: 321, to: 330, suit: 'wands', rank: 'two' },
  { from: 331, to: 410, suit: 'wands', rank: 'three' },
  { from: 411, to: 420, suit: 'wands', rank: 'four' },
  { from: 421, to: 430, suit: 'disks', rank: 'five' },
  { from: 501, to: 510, suit: 'disks', rank: 'six' },
  { from: 511, to: 520, suit: 'disks', rank: 'seven' },
  { from: 521, to: 531, suit: 'swords', rank: 'eight' },
  { from: 601, to: 610, suit: 'swords', rank: 'nine' },
  { from: 611, to: 620, suit: 'swords', rank: 'ten' },
  { from: 621, to: 701, suit: 'cups', rank: 'two' },
  { from: 702, to: 712, suit: 'cups', rank: 'three' },
  { from: 713, to: 720, suit: 'cups', rank: 'four' },
  { from: 721, to: 801, suit: 'wands', rank: 'five' },
  { from: 802, to: 810, suit: 'wands', rank: 'six' },
  { from: 811, to: 822, suit: 'wands', rank: 'seven' },
  { from: 823, to: 901, suit: 'disks', rank: 'eight' },
  { from: 902, to: 911, suit: 'disks', rank: 'nine' },
  { from: 912, to: 922, suit: 'disks', rank: 'ten' },
  { from: 923, to: 1002, suit: 'swords', rank: 'two' },
  { from: 1003, to: 1012, suit: 'swords', rank: 'three' },
  { from: 1013, to: 1022, suit: 'swords', rank: 'four' },
  { from: 1023, to: 1101, suit: 'cups', rank: 'five' },
  { from: 1102, to: 1111, suit: 'cups', rank: 'six' },
  { from: 1112, to: 1122, suit: 'cups', rank: 'seven' },
  { from: 1123, to: 1202, suit: 'wands', rank: 'eight' },
  { from: 1203, to: 1212, suit: 'wands', rank: 'nine' },
  { from: 1213, to: 1220, suit: 'wands', rank: 'ten' },
  { from: 1221, to: 1230, suit: 'disks', rank: 'two' },
  { from: 1231, to: 109, suit: 'disks', rank: 'three' },
  { from: 110, to: 119, suit: 'disks', rank: 'four' },
  { from: 120, to: 130, suit: 'swords', rank: 'five' },
  { from: 131, to: 208, suit: 'swords', rank: 'six' },
  { from: 209, to: 218, suit: 'swords', rank: 'seven' },
  { from: 219, to: 228, suit: 'cups', rank: 'eight' },
  { from: 301, to: 310, suit: 'cups', rank: 'nine' },
  { from: 311, to: 320, suit: 'cups', rank: 'ten' },
] as const

function inRange(mmdd: number, from: number, to: number) {
  return from <= to ? mmdd >= from && mmdd <= to : mmdd >= from || mmdd <= to
}

function toMonthDay(dateOfBirth: string) {
  const parts = dateOfBirth.split('-').map(Number)
  if (parts.length !== 3 || parts.some((part) => !Number.isFinite(part))) {
    throw new Error('Expected date of birth to be YYYY-MM-DD.')
  }

  return parts[1] * 100 + parts[2]
}

export function getBirthdayProfile(dateOfBirth: string) {
  const mmdd = toMonthDay(dateOfBirth)
  const sunSign = signRanges.find(([_, from, to]) => inRange(mmdd, from, to))?.[0]

  if (!sunSign) {
    throw new Error('Unable to calculate birthday correspondences.')
  }

  const court = courtTable.find((entry) => inRange(mmdd, entry.from, entry.to))
  const decan = decanTable.find((entry) => inRange(mmdd, entry.from, entry.to))
  const element = signElements[sunSign]

  return {
    sunSign,
    sunSignAtu: signAtuMap[sunSign],
    planetaryRulerAtu: planetaryRulerMap[sunSign],
    element,
    elementalAce: {
      suit: elementSuit[element],
      rank: 'ace',
    },
    court,
    decan,
  }
}
