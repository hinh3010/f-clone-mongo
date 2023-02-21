/* eslint-disable @typescript-eslint/restrict-template-expressions */
import path from 'path'

export const parsePathToScope = (filepath: any): string => {
  if (filepath.indexOf(path.sep) >= 0) {
    filepath = filepath.replace(process.cwd(), '')
    filepath = filepath.replace(`${path.sep}src${path.sep}`, '')
    filepath = filepath.replace(`${path.sep}dist${path.sep}`, '')
    filepath = filepath.replace('.ts', '')
    filepath = filepath.replace('.js', '')
    filepath = filepath.replace(path.sep, ':')
  }
  return filepath
}

export const logger = (content: string): void => {
  console.error(`
    ${content}
  `)
}
