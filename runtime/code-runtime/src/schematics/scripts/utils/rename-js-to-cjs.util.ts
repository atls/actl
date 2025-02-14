/* eslint-disable n/no-sync */

import { renameSync }            from 'fs'
import { extname }               from 'path'
import { join }                  from 'path'
import { dirname }               from 'path'
import { basename }              from 'path'

import { RenameJsToCjsError }    from '../errors/index.js'
import { getAllFiles }           from '../getters/index.js'
import { checkTemplateFileUtil } from '../utils/index.js'

type RenameJsToCjsUtilProps = {
  outDir: string
}

export const renameJsToCjsUtil = ({ outDir }: RenameJsToCjsUtilProps): boolean => {
  try {
    getAllFiles(outDir).forEach((file) => {
      const isTemplate = checkTemplateFileUtil(outDir, file)
      if (extname(file) === '.js' && !isTemplate) {
        const newPath = join(dirname(file), `${basename(file, '.js')}.cjs`)
        renameSync(file, newPath)
      }
    })
    return true
  } catch {
    throw new RenameJsToCjsError()
  }
}
