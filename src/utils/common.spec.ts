import { isElement, isEmpty, isTextNode } from '~/utils/common'
import { handleHTML } from 'testing-utils'

describe('isElement', () => {
  it('should detect the node which is the element', () => {
    const element = document.createElement('div')
    expect(isElement(element)).toBeTruthy()

    const textNode = document.createTextNode('content')
    expect(isElement(textNode)).toBeFalsy()

    const attr = document.createAttribute('title')
    expect(isElement(attr)).toBeFalsy()
  })
})

describe('isTextNode', () => {
  it('should detect the text node', () => {
    const element = document.createElement('div')
    expect(isTextNode(element)).toBeFalsy()

    const textNode = document.createTextNode('content')
    expect(isTextNode(textNode)).toBeTruthy()

    const attr = document.createAttribute('title')
    expect(isTextNode(attr)).toBeFalsy()
  })
})

describe('isEmpty', () => {
  it('should detect whether the node is empty or not', () => {
    const result1 = handleHTML('<p><a><i></i></a> <br /><b></b></p>', isEmpty, {
      returnValue: 'result'
    })
    expect(result1).toBeTruthy()

    const result2 = handleHTML(
      '<p><a><i>link</i></a> <br /><b></b></p>',
      isEmpty,
      {
        returnValue: 'result'
      }
    )
    expect(result2).toBeFalsy()
  })
})
