import { findRule } from '~/utils/findRule'

describe('findRule', () => {
  it('should return undefined if there is no matching rule', () => {
    const result = findRule('div', { h1: {}, p: {}, 'b,i,a': {} })
    expect(result).toBeUndefined()
  })

  it('should return the rule no matter at what position the target tag is specified', () => {
    const rule1 = findRule('div', { div: {} })
    expect(rule1).not.toBeUndefined()

    const rule2 = findRule('div', { 'div,h1': {} })
    expect(rule2).not.toBeUndefined()

    const rule3 = findRule('div', { 'p,div': {} })
    expect(rule3).not.toBeUndefined()

    const rule4 = findRule('div', { 'p,div,span': {} })
    expect(rule4).not.toBeUndefined()

    const rule5 = findRule('div', { 'p,,,,,div,': {} })
    expect(rule5).not.toBeUndefined()
  })

  it('should return only the first matching rule', () => {
    const result = findRule('div', {
      div: { convertTo: 'section' },
      p: {},
      'b,i,a,div': { noEmpty: true }
    })
    expect(result).toMatchObject({ convertTo: 'section' })
  })
})
