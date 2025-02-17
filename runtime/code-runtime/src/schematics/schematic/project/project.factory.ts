import type { Rule }                     from '@angular-devkit/schematics'

import { MergeStrategy }                 from '@angular-devkit/schematics'
import { chain }                         from '@angular-devkit/schematics'
import { mergeWith }                     from '@angular-devkit/schematics'

import { updateTsConfigRule }            from '../rules/index.js'
import { generateCommonSource }          from '../sources/index.js'
import { generateProjectSpecificSource } from '../sources/index.js'

export const main = (options: Record<string, string>): Rule =>
  chain([
    updateTsConfigRule,
    mergeWith(generateCommonSource(options), MergeStrategy.Overwrite),
    mergeWith(generateProjectSpecificSource(options), MergeStrategy.Overwrite),
  ])
