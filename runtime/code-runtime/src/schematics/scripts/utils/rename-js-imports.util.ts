/* eslint-disable n/no-sync */

import { readFileSync }         from 'fs'
import { writeFileSync }        from 'fs'
import { extname }              from 'path'

import { RenameJsImportsError } from '../errors/index.js'
import { getAllFiles }          from '../getters/index.js'

interface RenameJsImportsUtilProps {
  outDir: string
}

export const renameJsImportsUtil = ({ outDir }: RenameJsImportsUtilProps): boolean => {
  try {
    getAllFiles(outDir).forEach((file) => {
      if (extname(file) === '.cjs') {
        let content = readFileSync(file, 'utf8')
        content = content.replace(/(\.js)(['"])/g, '.cjs$2')
        writeFileSync(file, content)
      }
    })

    return true
  } catch {
    throw new RenameJsImportsError()
  }
}
