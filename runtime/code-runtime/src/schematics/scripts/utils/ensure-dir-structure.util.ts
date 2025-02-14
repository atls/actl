import { mkdirSync } from 'node:fs'
import { dirname }   from 'node:path'

export const ensureDirStructureUtil = (filePath: string): void => {
  const dir = dirname(filePath)
  // eslint-disable-next-line n/no-sync
  mkdirSync(dir, { recursive: true })
}
