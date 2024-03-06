import { validateCollection } from '~/utils/validateCollection'

export const validateClasses = (
  element: HTMLElement,
  validClasses?: string
): void => {
  if (validClasses == null || element.classList.length === 0) {
    return
  }

  validateCollection({
    collection: element.classList,
    validVariants: validClasses,
    onInvalid: (item) => {
      element.classList.remove(item)
    }
  })

  if (element.classList.length === 0) {
    element.removeAttribute('class')
  }
}
