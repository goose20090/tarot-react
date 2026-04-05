import { describe, expect, it } from 'vitest'
import { getBirthdayProfile } from './birthday'

describe('getBirthdayProfile', () => {
  it('calculates Aries birthday correspondences', () => {
    const profile = getBirthdayProfile('1990-03-25')

    expect(profile.sunSign).toBe('aries')
    expect(profile.sunSignAtu).toBe(4)
    expect(profile.planetaryRulerAtu).toBe(16)
    expect(profile.elementalAce).toEqual({
      suit: 'wands',
      rank: 'ace',
    })
    expect(profile.decan).toEqual({
      from: 321,
      to: 330,
      suit: 'wands',
      rank: 'two',
    })
    expect(profile.court).toEqual({
      from: 311,
      to: 410,
      suit: 'wands',
      rank: 'queen',
    })
  })

  it('handles wrapped Capricorn ranges correctly', () => {
    const profile = getBirthdayProfile('1990-01-05')

    expect(profile.sunSign).toBe('capricorn')
    expect(profile.sunSignAtu).toBe(15)
    expect(profile.planetaryRulerAtu).toBe(21)
    expect(profile.elementalAce).toEqual({
      suit: 'disks',
      rank: 'ace',
    })
  })
})
