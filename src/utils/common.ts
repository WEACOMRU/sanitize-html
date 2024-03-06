import { EMPTY_TEXT_NODE_REGEXP } from '~/constants/common'

export const isElement = (node: Node): node is HTMLElement =>
  node.nodeType === Node.ELEMENT_NODE

export const isTextNode = (node: Node): node is Text =>
  node.nodeType === Node.TEXT_NODE

export const isEmpty = (node: Node): boolean =>
  Array.from(node.childNodes).every((childNode) => {
    if (isElement(childNode)) {
      return isEmpty(childNode)
    } else if (isTextNode(childNode)) {
      return (
        childNode.nodeValue == null ||
        EMPTY_TEXT_NODE_REGEXP.test(childNode.nodeValue)
      )
    }
    return false
  })
