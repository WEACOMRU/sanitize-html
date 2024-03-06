import { handleHTML } from 'testing-utils'
import { validateStyles } from '~/utils/validateStyles'

describe('validateStyles', () => {
  it('should skip elements without styles', () => {
    const result = handleHTML('<div>content</div>', (container) => {
      validateStyles(container.children[0] as HTMLElement, '')
    })

    expect(result).toBe('<div>content</div>')
  })

  it('should allow all styles if the rule is not specified', () => {
    const result = handleHTML(
      '<div style="font-size: 1.5em; font-weight: bold; text-transform: uppercase">Big</div>',
      (container) => {
        validateStyles(container.children[0] as HTMLElement)
      }
    )

    expect(result).toBe(
      '<div style="font-size: 1.5em; font-weight: bold; text-transform: uppercase">Big</div>'
    )
  })

  it('should only allow those styles that are specified in the rule', () => {
    const result = handleHTML(
      '<div style="font-size: 1.5em; font-weight: bold; text-transform: uppercase">Big</div>',
      (container) => {
        validateStyles(
          container.children[0] as HTMLElement,
          'text-transform,width'
        )
      }
    )

    expect(result).toBe('<div style="text-transform: uppercase;">Big</div>')
  })

  it('should allow those styles that match the mask', () => {
    const result = handleHTML(
      '<div style="font-size: 1.5em; font-weight: bold; text-transform: uppercase">Big</div>',
      (container) => {
        validateStyles(container.children[0] as HTMLElement, 'font-*')
      }
    )

    expect(result).toBe(
      '<div style="font-size: 1.5em; font-weight: bold;">Big</div>'
    )
  })

  it('should remove the style attribute if it becomes empty after validation', () => {
    const result = handleHTML(
      '<div style="font-size: 1.5em; font-weight: bold; text-transform: uppercase">Big</div>',
      (container) => {
        validateStyles(container.children[0] as HTMLElement, '')
      }
    )

    expect(result).toBe('<div>Big</div>')
  })
})
