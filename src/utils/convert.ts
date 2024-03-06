export const convert = (element: Element, targetTagName: string): void => {
  const parentElement = element.parentElement
  const targetElement = document.createElement(targetTagName)

  for (const attribute of element.attributes) {
    targetElement.setAttribute(attribute.name, attribute.value)
  }

  while (element.childNodes.length > 0) {
    targetElement.appendChild(element.childNodes[0])
  }

  parentElement?.replaceChild(targetElement, element)
}
