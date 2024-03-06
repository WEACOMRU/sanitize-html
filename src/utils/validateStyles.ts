import { validateCollection } from '~/utils/validateCollection'

export const validateStyles = (
  element: HTMLElement,
  validStyles?: string
): void => {
  if (validStyles == null || element.style.length === 0) {
    return
  }

  validateCollection({
    collection: element.style,
    validVariants: validStyles,
    onInvalid: (item) => {
      element.style.removeProperty(item)
    }
  })

  if (element.style.length === 0) {
    element.removeAttribute('style')
  }
}
