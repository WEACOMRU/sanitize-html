import { type Rules, type TextRule } from '~/models/rules'
import { isElement, isEmpty, isTextNode } from '~/utils/common'
import type { Task } from '~/models/task'
import { completeTask } from '~/utils/completeTask'
import { findRule } from '~/utils/findRule'
import { validateAttributes } from '~/utils/validateAttributes'
import { validateStyles } from '~/utils/validateStyles'
import { validateClasses } from '~/utils/validateClasses'

export const sanitize = (node: Node, rules: Rules): void => {
  const tasks: Array<Task<HTMLElement>> = []

  node.childNodes.forEach((node) => {
    if (isElement(node)) {
      sanitizeElement(node, rules, tasks)
    } else if (isTextNode(node) && rules.text != null) {
      sanitizeText(node, rules.text)
    }
  })

  tasks.forEach(completeTask)
}

const sanitizeElement = <T extends HTMLElement>(
  element: T,
  rules: Rules,
  tasks: Array<Task<T>>
): void => {
  const rule = findRule(element.tagName, rules.validElements)
  sanitize(
    element,
    rule?.validChildren != null
      ? { text: rules.text, validElements: rule?.validChildren }
      : rules
  )

  if (rule == null) {
    tasks.push({ type: 'unpack', element }, { type: 'remove', element })
  } else {
    if (rule.noEmpty === true && isEmpty(element)) {
      tasks.push({ type: 'remove', element })
    } else {
      validateAttributes(element, rule.validAttributes)
      validateStyles(element, rule.validStyles)
      validateClasses(element, rule.validClasses)

      if (rule.convertTo != null) {
        tasks.push({
          type: 'convert',
          element,
          convertTo: rule.convertTo
        })
      }

      if (typeof rule.process === 'function') {
        tasks.push({
          type: 'process',
          element,
          process: rule.process
        })
      }
    }
  }
}

const sanitizeText = (textNode: Text, rule: TextRule): void => {
  if (textNode.nodeValue == null) {
    return
  }
  if (rule.noNBSP === true) {
    textNode.nodeValue = textNode.nodeValue.replace(/\xa0/g, ' ')
  }
  if (rule.processText != null) {
    textNode.nodeValue = rule.processText(textNode.nodeValue)
  }
}
