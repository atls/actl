import type { Rule }             from '@angular-devkit/schematics'
import type { SchematicContext } from '@angular-devkit/schematics'
import type { Tree }             from '@angular-devkit/schematics'

const GITIGNORE_PATH = '.gitignore'

export const updateGitIgnoreInTree = (
    callback: (lines: Array<string>, context: SchematicContext) => Array<string>
  ): Rule =>
  (host: Tree, context: SchematicContext): Tree => {
    if (!host.exists(GITIGNORE_PATH)) {
      host.create(GITIGNORE_PATH, '')
    }

    const gitignoreBuffer = host.read(GITIGNORE_PATH)

    if (!gitignoreBuffer) return host

    const content: Array<string> = gitignoreBuffer.toString('utf-8').split('\n')

    host.overwrite(GITIGNORE_PATH, Array.from(callback(content, context)).join('\n'))

    return host
  }
