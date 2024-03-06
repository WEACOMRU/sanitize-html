import { handleHTML } from 'testing-utils'
import { convert } from '~/utils/convert'

describe('convert', () => {
  it('should convert the given element to the target one', () => {
    const result = handleHTML('<b>important</b>', (container) => {
      convert(container.children[0], 'i')
    })

    expect(result).toBe('<i>important</i>')
  })

  it('should move all children of the given element to the target one', () => {
    const result = handleHTML(
      '<div><h1>ToDo</h1><ul><li>write test cases</li><li>implement solution</li></ul></div>',
      (container) => {
        convert(container.children[0], 'section')
      }
    )

    expect(result).toBe(
      '<section><h1>ToDo</h1><ul><li>write test cases</li><li>implement solution</li></ul></section>'
    )
  })

  it('should copy styles and classes from the given element to the target one', () => {
    const result = handleHTML(
      '<b style="font-size: .75em;" class="typography">important</b>',
      (container) => {
        convert(container.children[0], 'i')
      }
    )

    expect(result).toBe(
      '<i style="font-size: .75em;" class="typography">important</i>'
    )
  })

  it('should copy attributes from the given element to the target one', () => {
    const result = handleHTML(
      '<span id="first-name-label" data-testid="first-name-label" title="First Name" aria-label="First Name">First Name</span>',
      (container) => {
        convert(container.children[0], 'label')
      }
    )

    expect(result).toBe(
      '<label id="first-name-label" data-testid="first-name-label" title="First Name" aria-label="First Name">First Name</label>'
    )
  })
})
