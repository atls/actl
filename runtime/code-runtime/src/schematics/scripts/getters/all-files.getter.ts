/* eslint-disable n/no-sync */

import { statSync }    from 'node:fs'
import { readdirSync } from 'node:fs'
import { join }        from 'node:path'

export const getAllFiles = (dir: string, fileList: Array<string> = []): Array<string> => {
  readdirSync(dir).forEach((file) => {
    const fullPath = join(dir, file)
    if (statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, fileList)
    } else {
      fileList.push(fullPath)
    }
  })
  return fileList
}
