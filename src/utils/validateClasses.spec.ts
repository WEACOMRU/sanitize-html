import { handleHTML } from 'testing-utils'
import { validateClasses } from '~/utils/validateClasses'

describe('validateClasses', () => {
  it('should skip elements without classes', () => {
    const result = handleHTML('<div>content</div>', (container) => {
      validateClasses(container.children[0] as HTMLElement, '')
    })

    expect(result).toBe('<div>content</div>')
  })

  it('should allow all classes if the rule is not specified', () => {
    const result = handleHTML(
      '<div class="container text-center lead">Big</div>',
      (container) => {
        validateClasses(container.children[0] as HTMLElement)
      }
    )

    expect(result).toBe('<div class="container text-center lead">Big</div>')
  })

  it('should only allow those classes that are specified in the rule', () => {
    const result = handleHTML(
      '<div class="container text-center lead">Big</div>',
      (container) => {
        validateClasses(container.children[0] as HTMLElement, 'lead')
      }
    )

    expect(result).toBe('<div class="lead">Big</div>')
  })

  it('should allow those classes that match the mask', () => {
    const result = handleHTML(
      '<div class="container text-center text-bold lead">Big</div>',
      (container) => {
        validateClasses(container.children[0] as HTMLElement, 'text-*')
      }
    )

    expect(result).toBe('<div class="text-center text-bold">Big</div>')
  })

  it('should remove the class attribute if it becomes empty after validation', () => {
    const result = handleHTML(
      '<div class="container text-center lead">Big</div>',
      (container) => {
        validateClasses(container.children[0] as HTMLElement, '')
      }
    )

    expect(result).toBe('<div>Big</div>')
  })
})
