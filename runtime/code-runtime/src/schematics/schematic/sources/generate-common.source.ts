import type { Source } from '@angular-devkit/schematics'

import { strings }     from '@angular-devkit/core'
import { apply }       from '@angular-devkit/schematics'
import { template }    from '@angular-devkit/schematics'
import { move }        from '@angular-devkit/schematics'
import { url }         from '@angular-devkit/schematics'

export const generateCommonSource = (options: Record<string, string>): Source =>
  apply(url('../templates/common'), [
    template({
      ...strings,
      ...options,
      dot: '.',
    }),
    move('./'),
  ])
