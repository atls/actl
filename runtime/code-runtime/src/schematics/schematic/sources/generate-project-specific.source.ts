import type { Source }  from '@angular-devkit/schematics'

import { readFileSync } from 'node:fs'
import { join }         from 'node:path'

import { strings }      from '@angular-devkit/core'
import { apply }        from '@angular-devkit/schematics'
import { url }          from '@angular-devkit/schematics'
import { template }     from '@angular-devkit/schematics'
import { move }         from '@angular-devkit/schematics'

export const generateProjectSpecificSource = (options: Record<string, string>): Source => {
  const { name: projectName } = JSON.parse(
    // eslint-disable-next-line n/no-sync
    readFileSync(join(options.cwd, 'package.json'), 'utf-8')
  )

  return apply(url(join('../templates', options.type)), [
    template({
      ...strings,
      ...options,
      projectName,
      dot: '.',
    }),
    move('./'),
  ])
}
