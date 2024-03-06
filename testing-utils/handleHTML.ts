export interface HandleHTMLOptions {
  returnValue?: 'html' | 'result'
}

export const handleHTML = <T = any>(
  html: string,
  handler: (container: HTMLElement) => T,
  { returnValue = 'html' }: HandleHTMLOptions = {}
): string | T => {
  const container = document.createElement('div')
  container.innerHTML = html
  const result = handler(container)
  return returnValue === 'html' ? container.innerHTML : result
}
