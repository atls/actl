/* eslint-disable no-console */

import { esbuildBuildStep } from './build-steps/index.js'

try {
  await esbuildBuildStep()
} catch (e: unknown) {
  const error = e as Error

  console.error('Schematic build error!')
  console.error(error.message)
}

console.info('Schematic build successed')
