import { type Rule } from '~/models/rules'

export const findRule = (
  tagName: string,
  validElements: Record<string, Rule>
): Rule | undefined => {
  const re = new RegExp(`(^|,)${tagName.toLowerCase()}(,|$)`)

  for (const ruleKey of Object.keys(validElements)) {
    if (re.test(ruleKey)) {
      return validElements[ruleKey]
    }
  }
}
