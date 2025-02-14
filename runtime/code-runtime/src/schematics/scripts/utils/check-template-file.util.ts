import { relative } from 'node:path'

const checkTemplatesDir = (relativePath: string): boolean =>
  relativePath.split('/')[0] === 'templates'

export const checkTemplateFileUtil = (dir: string, file: string): boolean => {
  const relativePath = relative(dir, file)
  return checkTemplatesDir(relativePath)
}
