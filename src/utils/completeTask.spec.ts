import { handleHTML } from 'testing-utils'
import { completeTask } from '~/utils/completeTask'

describe('completeTask', () => {
  it('should complete "remove" task', () => {
    const result = handleHTML(
      "<b>It's going to be deleted</b>",
      (container) => {
        completeTask({
          type: 'remove',
          element: container.children[0] as HTMLElement
        })
      }
    )
    expect(result).toBe('')
  })

  it('should complete "convert" task', () => {
    const result = handleHTML('<h1>Title</h1>', (container) => {
      completeTask({
        type: 'convert',
        element: container.children[0] as HTMLElement,
        convertTo: 'h2'
      })
    })
    expect(result).toBe('<h2>Title</h2>')
  })

  it('should complete "process" task', () => {
    const result = handleHTML(
      '<a href="https://qodunpob.github.io/">qodunpob</a>',
      (container) => {
        completeTask({
          type: 'process',
          element: container.children[0] as HTMLElement,
          process: (a: Element) => {
            a.setAttribute('target', '_blank')
          }
        })
      }
    )
    expect(result).toBe(
      '<a href="https://qodunpob.github.io/" target="_blank">qodunpob</a>'
    )
  })

  it('should complete "unpack" task', () => {
    const result = handleHTML(
      '<div><p>First sentence</p><p>Second sentence</p></div>',
      (container) => {
        completeTask({
          type: 'unpack',
          element: container.children[0] as HTMLElement
        })
      }
    )
    expect(result).toBe(
      '<p>First sentence</p><p>Second sentence</p><div></div>'
    )
  })
})
