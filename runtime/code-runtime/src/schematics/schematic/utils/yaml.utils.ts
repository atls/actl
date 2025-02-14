/* eslint-disable */

import type { Rule }             from '@angular-devkit/schematics'
import type { SchematicContext } from '@angular-devkit/schematics'
import type { Tree }             from '@angular-devkit/schematics'

// @ts-expect-error
import { load }                  from 'js-yaml'
// @ts-expect-error
import { dump }                  from 'js-yaml'

export const readYamlInTree = <T = any>(host: Tree, path: string): T => {
  if (!host.exists(path)) {
    throw new Error(`Cannot find ${path}`)
  }

  return load(host.read(path)!.toString('utf-8')) as any
}

export const updateYamlInTree = <T = any, O = T>(
    path: string,
    callback: (yaml: T, context: SchematicContext) => O
  ): Rule =>
  (host: Tree, context: SchematicContext): Tree => {
    if (!host.exists(path)) {
      return host
    }

    host.overwrite(
      path,
      dump(callback(readYamlInTree(host, path), context), {
        noArrayIndent: true,
        lineWidth: -1,
      })
    )

    return host
  }
