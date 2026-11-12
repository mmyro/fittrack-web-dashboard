import { ACTIVITY_TYPES } from '../types'
import { FALLBACK_IMAGE, getActivityMeta } from './activityImages'

describe('activityImages', () => {
  it('has an image, an alt text and a color for every category', () => {
    for (const type of ACTIVITY_TYPES) {
      const meta = getActivityMeta(type)
      expect(meta.image).toBe(`/images/activities/${type.toLowerCase()}.jpg`)
      expect(meta.alt).not.toBe('')
      expect(meta.color).toMatch(/^#[0-9a-f]{6}$/i)
    }
  })

  it('returns the fallback image for an unknown category', () => {
    expect(getActivityMeta('Strength').image).toBe(FALLBACK_IMAGE)
  })
})