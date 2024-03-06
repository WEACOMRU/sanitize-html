export interface Collection<T> {
  readonly length: number
  item: (index: number) => T | null
}

export interface ValidateCollectionProps<T> {
  collection: Collection<T>
  validVariants: string
  toStringItem?: (item: T) => string
  onInvalid: (item: T) => void
}

export const validateCollection = <T>({
  collection,
  validVariants,
  toStringItem = (item) => String(item),
  onInvalid
}: ValidateCollectionProps<T>): void => {
  const validVariantsArray = validVariants.split(',').map(makeValidator)

  for (let i = collection.length - 1; i >= 0; i--) {
    const item = collection.item(i)

    if (item == null) {
      continue
    }
    if (!validVariantsArray.some(validateItem(toStringItem(item)))) {
      onInvalid(item)
    }
  }
}

const makeValidator = (variant: string): string | RegExp =>
  variant.includes('*') ? new RegExp(variant.replace('*', '.')) : variant

const validateItem = (item: string) => (validator: string | RegExp) =>
  validator instanceof RegExp ? validator.test(item) : validator === item
