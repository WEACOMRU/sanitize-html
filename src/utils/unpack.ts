export const unpack = (element: Element): void => {
  const parentElement = element.parentElement
  if (parentElement == null) {
    return
  }

  while (element.childNodes.length > 0) {
    parentElement.insertBefore(element.childNodes[0], element)
  }
}
