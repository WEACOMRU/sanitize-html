import { validateCollection } from '~/utils/validateCollection'

export const validateAttributes = (
  element: HTMLElement,
  validAttributes?: string
): void => {
  if (validAttributes == null || element.attributes.length === 0) {
    return
  }

  validateCollection({
    collection: element.attributes,
    validVariants: validAttributes,
    toStringItem: (item) => item.name,
    onInvalid: (item) => {
      element.removeAttribute(item.name)
    }
  })
}
