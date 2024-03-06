export interface Rule {
  convertTo?: string
  validAttributes?: string
  validStyles?: string
  validClasses?: string
  noEmpty?: boolean
  process?: (element: HTMLElement) => void
  validChildren?: Record<string, Rule>
}

export interface TextRule {
  noNBSP?: boolean
  processText?: (text: string) => string
}

export interface Rules {
  text?: TextRule
  validElements: Record<string, Rule>
}
