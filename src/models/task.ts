export type Task<T extends HTMLElement> =
  | RemoveTask<T>
  | ConvertTask<T>
  | ProcessTask<T>
  | UnpackTask<T>

export interface RemoveTask<T extends HTMLElement> {
  type: 'remove'
  element: T
}

export interface ConvertTask<T extends HTMLElement> {
  type: 'convert'
  element: T
  convertTo: string
}

export interface ProcessTask<T extends HTMLElement> {
  type: 'process'
  element: T
  process: (element: T) => void
}

export interface UnpackTask<T extends HTMLElement> {
  type: 'unpack'
  element: T
}
