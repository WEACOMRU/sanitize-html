import { handleHTML } from 'testing-utils'
import { validateAttributes } from '~/utils/validateAttributes'

describe('validateAttributes', () => {
  it('should skip elements without attributes', () => {
    const result = handleHTML('<div>content</div>', (container) => {
      validateAttributes(container.children[0] as HTMLElement, '')
    })

    expect(result).toBe('<div>content</div>')
  })

  it('should allow all attributes if the rule is not specified', () => {
    const result = handleHTML(
      '<div id="label-big" class="lead" data-testid="discount-label-big">Big</div>',
      (container) => {
        validateAttributes(container.children[0] as HTMLElement)
      }
    )

    expect(result).toBe(
      '<div id="label-big" class="lead" data-testid="discount-label-big">Big</div>'
    )
  })

  it('should only allow those attributes that are specified in the rule', () => {
    const result = handleHTML(
      '<div id="label-big" class="lead" data-testid="discount-label-big">Big</div>',
      (container) => {
        validateAttributes(container.children[0] as HTMLElement, 'id,class')
      }
    )

    expect(result).toBe('<div id="label-big" class="lead">Big</div>')
  })

  it('should allow those attributes that match the mask', () => {
    const result = handleHTML(
      '<div id="label-big" class="lead" data-testid="discount-label-big">Big</div>',
      (container) => {
        validateAttributes(container.children[0] as HTMLElement, 'data-*')
      }
    )

    expect(result).toBe('<div data-testid="discount-label-big">Big</div>')
  })
})
