/* eslint-disable no-console */

import { join }                from 'path'
import { fileURLToPath }       from 'url'

import { getAllFiles }         from './getters/index.js'
import { renameJsToCjsUtil }   from './utils/index.js'
import { copyTemplatesUtil }   from './utils/index.js'
import { renameJsImportsUtil } from './utils/index.js'

const dir = fileURLToPath(new URL('.', import.meta.url))
const srcDir = join(dir, '../schematic/')
const outDir = join(dir, '../../../dist/schematic/')

const allFiles = getAllFiles(srcDir)

try {
  renameJsToCjsUtil({ outDir })
  copyTemplatesUtil({ srcDir, outDir, allFiles })
  renameJsImportsUtil({ outDir })
} catch (e: unknown) {
  const error = e as Error

  console.error('Schematic prepack error!')
  console.error(error.message)
}

console.info('Schematic prepack successed')
