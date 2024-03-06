import { type Task } from '~/models/task'
import { convert } from '~/utils/convert'
import { unpack } from '~/utils/unpack'

export const completeTask = <T extends HTMLElement>(task: Task<T>): void => {
  switch (task.type) {
    case 'remove':
      task.element.parentNode?.removeChild(task.element)
      return
    case 'convert':
      convert(task.element, task.convertTo)
      return
    case 'process':
      task.process(task.element)
      return
    case 'unpack':
      unpack(task.element)
  }
}
