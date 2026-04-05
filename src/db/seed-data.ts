export const alchemicalPrinciplesSeed = [
  {
    name: 'Sulphur',
    symbol: '🜍',
    guna: 'Rajas',
    nature:
      'The active, fiery, masculine principle. Volatile, expansive energy, the will that initiates.',
  },
  {
    name: 'Salt',
    symbol: '🜔',
    guna: 'Tamas',
    nature:
      'The receptive, earthy, feminine principle. Fixed, contracting energy, the body that receives.',
  },
  {
    name: 'Mercury',
    symbol: '☿',
    guna: 'Sattva',
    nature:
      'The synthesising, fluid, androgynous principle. The mediator between Sulphur and Salt, distinct from the planet.',
  },
] as const

export const elementsSeed = [
  { name: 'Fire', symbol: '🜂' },
  { name: 'Water', symbol: '🜄' },
  { name: 'Air', symbol: '🜁' },
  { name: 'Earth', symbol: '🜃' },
] as const

export const sephirothSeed = [
  { number: 1, name: 'Kether', meaning: 'Crown' },
  { number: 2, name: 'Chokmah', meaning: 'Wisdom' },
  { number: 3, name: 'Binah', meaning: 'Understanding' },
  { number: 4, name: 'Chesed', meaning: 'Mercy' },
  { number: 5, name: 'Geburah', meaning: 'Severity' },
  { number: 6, name: 'Tiphareth', meaning: 'Beauty' },
  { number: 7, name: 'Netzach', meaning: 'Victory' },
  { number: 8, name: 'Hod', meaning: 'Splendor' },
  { number: 9, name: 'Yesod', meaning: 'Foundation' },
  { number: 10, name: 'Malkuth', meaning: 'Kingdom' },
] as const

export const zodiacSeed = [
  { name: 'Aries', element: 'Fire', modality: 'Cardinal', symbol: '♈' },
  { name: 'Taurus', element: 'Earth', modality: 'Fixed', symbol: '♉' },
  { name: 'Gemini', element: 'Air', modality: 'Mutable', symbol: '♊' },
  { name: 'Cancer', element: 'Water', modality: 'Cardinal', symbol: '♋' },
  { name: 'Leo', element: 'Fire', modality: 'Fixed', symbol: '♌' },
  { name: 'Virgo', element: 'Earth', modality: 'Mutable', symbol: '♍' },
  { name: 'Libra', element: 'Air', modality: 'Cardinal', symbol: '♎' },
  { name: 'Scorpio', element: 'Water', modality: 'Fixed', symbol: '♏' },
  { name: 'Sagittarius', element: 'Fire', modality: 'Mutable', symbol: '♐' },
  { name: 'Capricorn', element: 'Earth', modality: 'Cardinal', symbol: '♑' },
  { name: 'Aquarius', element: 'Air', modality: 'Fixed', symbol: '♒' },
  { name: 'Pisces', element: 'Water', modality: 'Mutable', symbol: '♓' },
] as const

export const planetsSeed = [
  { name: 'Sun', symbol: '☉' },
  { name: 'Moon', symbol: '☽' },
  { name: 'Mercury', symbol: '☿' },
  { name: 'Venus', symbol: '♀' },
  { name: 'Mars', symbol: '♂' },
  { name: 'Jupiter', symbol: '♃' },
  { name: 'Saturn', symbol: '♄' },
] as const

export const hebrewLettersSeed = [
  { name: 'Aleph', letter: 'א', meaning: 'Ox', number: 1, letterType: 'Mother', pathNumber: 11 },
  { name: 'Beth', letter: 'ב', meaning: 'House', number: 2, letterType: 'Double', pathNumber: 12 },
  { name: 'Gimel', letter: 'ג', meaning: 'Camel', number: 3, letterType: 'Double', pathNumber: 13 },
  { name: 'Daleth', letter: 'ד', meaning: 'Door', number: 4, letterType: 'Double', pathNumber: 14 },
  { name: 'Heh', letter: 'ה', meaning: 'Window', number: 5, letterType: 'Simple', pathNumber: 28 },
  { name: 'Vau', letter: 'ו', meaning: 'Nail', number: 6, letterType: 'Simple', pathNumber: 16 },
  { name: 'Zayin', letter: 'ז', meaning: 'Sword', number: 7, letterType: 'Simple', pathNumber: 17 },
  { name: 'Cheth', letter: 'ח', meaning: 'Fence', number: 8, letterType: 'Simple', pathNumber: 18 },
  { name: 'Teth', letter: 'ט', meaning: 'Serpent', number: 9, letterType: 'Simple', pathNumber: 19 },
  { name: 'Yod', letter: 'י', meaning: 'Hand', number: 10, letterType: 'Simple', pathNumber: 20 },
  { name: 'Kaph', letter: 'כ', meaning: 'Palm', number: 20, letterType: 'Double', pathNumber: 21 },
  { name: 'Lamed', letter: 'ל', meaning: 'Ox-goad', number: 30, letterType: 'Simple', pathNumber: 22 },
  { name: 'Mem', letter: 'מ', meaning: 'Water', number: 40, letterType: 'Mother', pathNumber: 23 },
  { name: 'Nun', letter: 'נ', meaning: 'Fish', number: 50, letterType: 'Simple', pathNumber: 24 },
  { name: 'Samekh', letter: 'ס', meaning: 'Prop', number: 60, letterType: 'Simple', pathNumber: 25 },
  { name: 'Ayin', letter: 'ע', meaning: 'Eye', number: 70, letterType: 'Simple', pathNumber: 26 },
  { name: 'Peh', letter: 'פ', meaning: 'Mouth', number: 80, letterType: 'Double', pathNumber: 27 },
  { name: 'Tzaddi', letter: 'צ', meaning: 'Fish-hook', number: 90, letterType: 'Simple', pathNumber: 15 },
  { name: 'Qoph', letter: 'ק', meaning: 'Back of head', number: 100, letterType: 'Simple', pathNumber: 29 },
  { name: 'Resh', letter: 'ר', meaning: 'Head', number: 200, letterType: 'Double', pathNumber: 30 },
  { name: 'Shin', letter: 'ש', meaning: 'Tooth', number: 300, letterType: 'Mother', pathNumber: 31 },
  { name: 'Tau', letter: 'ת', meaning: 'Cross', number: 400, letterType: 'Double', pathNumber: 32 },
] as const

export const pathsSeed = [
  { number: 11, start: 1, end: 2 },
  { number: 12, start: 1, end: 3 },
  { number: 13, start: 1, end: 6 },
  { number: 14, start: 2, end: 3 },
  { number: 15, start: 2, end: 6 },
  { number: 16, start: 2, end: 4 },
  { number: 17, start: 3, end: 6 },
  { number: 18, start: 3, end: 5 },
  { number: 19, start: 4, end: 5 },
  { number: 20, start: 4, end: 6 },
  { number: 21, start: 4, end: 7 },
  { number: 22, start: 5, end: 6 },
  { number: 23, start: 5, end: 8 },
  { number: 24, start: 6, end: 7 },
  { number: 25, start: 6, end: 9 },
  { number: 26, start: 6, end: 8 },
  { number: 27, start: 7, end: 8 },
  { number: 28, start: 7, end: 9 },
  { number: 29, start: 7, end: 10 },
  { number: 30, start: 8, end: 9 },
  { number: 31, start: 8, end: 10 },
  { number: 32, start: 9, end: 10 },
] as const

export const spreadsSeed = [
  {
    name: 'Single Card',
    description: 'A single card drawn for a simple question or daily reflection.',
    positions: [{ number: 1, name: null, significator: false }],
  },
  {
    name: 'Three Card',
    description: "Three cards drawn in sequence, open to the reader's interpretation.",
    positions: [
      { number: 1, name: null, significator: false },
      { number: 2, name: null, significator: false },
      { number: 3, name: null, significator: false },
    ],
  },
  {
    name: 'Past · Present · Future',
    description: 'Three cards representing the timeline of a situation.',
    positions: [
      { number: 1, name: 'Past', significator: false },
      { number: 2, name: 'Present', significator: false },
      { number: 3, name: 'Future', significator: false },
    ],
  },
  {
    name: 'Celtic Cross',
    description: 'A ten-card spread offering a comprehensive view of a situation.',
    positions: [
      { number: 1, name: 'Significator', significator: true },
      { number: 2, name: 'Crossing Card', significator: false },
      { number: 3, name: 'Foundation', significator: false },
      { number: 4, name: 'Recent Past', significator: false },
      { number: 5, name: 'Crown', significator: false },
      { number: 6, name: 'Near Future', significator: false },
      { number: 7, name: 'Self', significator: false },
      { number: 8, name: 'External Influences', significator: false },
      { number: 9, name: 'Hopes & Fears', significator: false },
      { number: 10, name: 'Outcome', significator: false },
    ],
  },
] as const
