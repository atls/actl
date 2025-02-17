/* eslint-disable no-console */

import { join }             from 'path'
import { fileURLToPath }    from 'url'

import { esbuildBuildStep } from './build-steps/index.js'
import { getAllFiles }      from './getters/index.js'

const dir = fileURLToPath(new URL('.', import.meta.url))
const srcDir = join(dir, '../schematic/')
const outDir = join(dir, '../../../dist/schematic/')

const allFiles = getAllFiles(srcDir)

try {
  await esbuildBuildStep({ allFiles, outDir })
} catch (e: unknown) {
  const error = e as Error

  console.error('Schematic build error!')
  console.error(error.message)
}

console.info('Schematic build successed')
