import type { Rule }             from '@angular-devkit/schematics'
import type { SchematicContext } from '@angular-devkit/schematics'
import type { Tree }             from '@angular-devkit/schematics'

export const updateFileInTree = (
    path: string,
    callback: (file: string, context: SchematicContext) => string
  ): Rule =>
  (host: Tree, context: SchematicContext): Tree => {
    if (host.exists(path)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      host.overwrite(path, callback(host.read(path)!.toString('utf-8'), context))
    }

    return host
  }
