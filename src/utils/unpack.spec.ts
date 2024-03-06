import { handleHTML } from 'testing-utils'
import { unpack } from '~/utils/unpack'

describe('unpack', () => {
  it('should move all child elements of the node to a higher level', () => {
    const result = handleHTML(
      '<span>It\'s <i>me</i>, <a href="https://qodunpob.github.io/"><b>qodunpob</b></a></span>',
      (container) => {
        unpack(container.children[0])
      }
    )

    expect(result).toBe(
      'It\'s <i>me</i>, <a href="https://qodunpob.github.io/"><b>qodunpob</b></a><span></span>'
    )
  })
})
