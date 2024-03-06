import { handleHTML } from 'testing-utils'
import { sanitize } from '~/sanitize'

const example =
  '<h1 data-testid="page-title" class="title indent-xl"><span style="color: red">HTML-formatting</span></h1><div></div><div class="caption"><span style="font-size: 1.25em">This is a simple tool for formatting (sanitizing) a&nbsp;peace&nbsp;of&nbsp;HTML</span></div>'

describe('sanitize', () => {
  it('should only allow the specified elements', () => {
    const result = handleHTML(example, (container) => {
      sanitize(container, { validElements: { 'h1,div': {} } })
    })
    expect(result).toBe(
      '<h1 data-testid="page-title" class="title indent-xl">HTML-formatting</h1><div></div><div class="caption">This is a simple tool for formatting (sanitizing) a&nbsp;peace&nbsp;of&nbsp;HTML</div>'
    )
  })

  it('should convert elements according to the given rules', () => {
    const result = handleHTML(example, (container) => {
      sanitize(container, {
        validElements: { h1: {}, div: { convertTo: 'p' } }
      })
    })
    expect(result).toBe(
      '<h1 data-testid="page-title" class="title indent-xl">HTML-formatting</h1><p></p><p class="caption">This is a simple tool for formatting (sanitizing) a&nbsp;peace&nbsp;of&nbsp;HTML</p>'
    )
  })

  it('should remove empty elements according to the given rules', () => {
    const result = handleHTML(example, (container) => {
      sanitize(container, { validElements: { 'h1,div': { noEmpty: true } } })
    })
    expect(result).toBe(
      '<h1 data-testid="page-title" class="title indent-xl">HTML-formatting</h1><div class="caption">This is a simple tool for formatting (sanitizing) a&nbsp;peace&nbsp;of&nbsp;HTML</div>'
    )
  })

  it('should only allow the specified classes', () => {
    const result = handleHTML(example, (container) => {
      sanitize(container, {
        validElements: {
          h1: { validClasses: 'title' },
          div: { validClasses: 'caption' }
        }
      })
    })
    expect(result).toBe(
      '<h1 data-testid="page-title" class="title">HTML-formatting</h1><div></div><div class="caption">This is a simple tool for formatting (sanitizing) a&nbsp;peace&nbsp;of&nbsp;HTML</div>'
    )
  })

  it('should only allow the specified styles', () => {
    const result = handleHTML(example, (container) => {
      sanitize(container, {
        validElements: {
          'h1,div': {},
          span: { validStyles: 'font-*' }
        }
      })
    })
    expect(result).toBe(
      '<h1 data-testid="page-title" class="title indent-xl"><span>HTML-formatting</span></h1><div></div><div class="caption"><span style="font-size: 1.25em">This is a simple tool for formatting (sanitizing) a&nbsp;peace&nbsp;of&nbsp;HTML</span></div>'
    )
  })

  it('should only allow the specified attributes', () => {
    const result = handleHTML(example, (container) => {
      sanitize(container, {
        validElements: { 'h1,div,span': { validAttributes: 'data-*,class' } }
      })
    })
    expect(result).toBe(
      '<h1 data-testid="page-title" class="title indent-xl"><span>HTML-formatting</span></h1><div></div><div class="caption"><span>This is a simple tool for formatting (sanitizing) a&nbsp;peace&nbsp;of&nbsp;HTML</span></div>'
    )
  })

  it('should not take into account validStyles or validClasses properties if the corresponding attributes are not allowed', () => {
    const result = handleHTML(example, (container) => {
      sanitize(container, {
        validElements: {
          'h1,div,span': {
            validAttributes: '',
            validClasses: 'title,caption',
            validStyles: 'font-*'
          }
        }
      })
    })
    expect(result).toBe(
      '<h1><span>HTML-formatting</span></h1><div></div><div><span>This is a simple tool for formatting (sanitizing) a&nbsp;peace&nbsp;of&nbsp;HTML</span></div>'
    )
  })

  it('should apply nested rules to elements if specified', () => {
    const result = handleHTML(example, (container) => {
      sanitize(container, {
        validElements: { h1: {}, div: { validChildren: { span: {} } } }
      })
    })
    expect(result).toBe(
      '<h1 data-testid="page-title" class="title indent-xl">HTML-formatting</h1><div></div><div class="caption"><span style="font-size: 1.25em">This is a simple tool for formatting (sanitizing) a&nbsp;peace&nbsp;of&nbsp;HTML</span></div>'
    )
  })

  it('should format text according to the given rules', () => {
    const result = handleHTML(example, (container) => {
      sanitize(container, {
        text: { noNBSP: true, processText: (text) => text.toUpperCase() },
        validElements: { 'h1,div': {} }
      })
    })
    expect(result).toBe(
      '<h1 data-testid="page-title" class="title indent-xl">HTML-FORMATTING</h1><div></div><div class="caption">THIS IS A SIMPLE TOOL FOR FORMATTING (SANITIZING) A PEACE OF HTML</div>'
    )
  })

  it('should format text even in case of nesting rules', () => {
    const result = handleHTML(example, (container) => {
      sanitize(container, {
        text: { noNBSP: true, processText: (text) => text.toUpperCase() },
        validElements: {
          h1: {},
          div: { validChildren: { span: { validAttributes: '' } } }
        }
      })
    })
    expect(result).toBe(
      '<h1 data-testid="page-title" class="title indent-xl">HTML-FORMATTING</h1><div></div><div class="caption"><span>THIS IS A SIMPLE TOOL FOR FORMATTING (SANITIZING) A PEACE OF HTML</span></div>'
    )
  })

  it('should process elements with a given method', () => {
    const result = handleHTML(example, (container) => {
      sanitize(container, {
        validElements: {
          h1: {},
          div: {
            process: (element) => {
              element.classList.add('page-section')
            }
          }
        }
      })
    })
    expect(result).toBe(
      '<h1 data-testid="page-title" class="title indent-xl">HTML-formatting</h1><div class="page-section"></div><div class="caption page-section">This is a simple tool for formatting (sanitizing) a&nbsp;peace&nbsp;of&nbsp;HTML</div>'
    )
  })
})
