/* eslint-disable */

import { updateJsonInTree } from './json.utils.js'

export const updateTsConfigInTree = (compilerOptions: object) =>
  updateJsonInTree('tsconfig.json', (tsconfig) => ({
    ...tsconfig,
    compilerOptions,
  }))
