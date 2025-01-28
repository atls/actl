/* eslint-disable */

import type { Rule }             from '@angular-devkit/schematics'
import type { SchematicContext } from '@angular-devkit/schematics'
import type { Tree }             from '@angular-devkit/schematics'

import stripJsonComments         from 'strip-json-comments'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const serializeJson = (json: string): string => `${JSON.stringify(json, null, 2)}\n`

export const readJsonInTree = (host: Tree, path: string): void => {
  if (!host.exists(path)) {
    throw new Error(`Cannot find ${path}`)
  }

  const contents = stripJsonComments(host.read(path)?.toString('utf-8') || '')

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return JSON.parse(contents)
  } catch (e: unknown) {
    const error = e as Error
    throw new Error(`Cannot parse ${path}: ${error.message}`)
  }
}

export const updateJsonInTree = <T = any, O = T>(
    path: string,
    callback: (json: T, context: SchematicContext) => O
  ): Rule =>
  (host: Tree, context: SchematicContext): Tree => {
    if (!host.exists(path)) {
      host.create(path, serializeJson(callback({} as T, context)))

      return host
    }

    host.overwrite(path, serializeJson(callback(readJsonInTree(host, path), context)))

    return host
  }
