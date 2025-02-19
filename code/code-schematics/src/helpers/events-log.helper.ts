/* eslint-disable no-console, default-case */

import type { DryRunEvent } from '@angular-devkit/schematics'

export const eventsLogHelper = (event: DryRunEvent): void => {
  const eventPath = event.path

  switch (event.kind) {
    case 'error':
      console.error(
        `ERROR! ${eventPath} ${
          event.description === 'alreadyExist' ? 'already exists' : 'does not exist'
        }.`
      )
      break
    case 'update':
      console.debug(`${'UPDATE'} ${eventPath} (${event.content.length} bytes)`)
      break
    case 'create':
      console.debug(`${'CREATE'} ${eventPath} (${event.content.length} bytes)`)
      break
    case 'delete':
      console.debug(`${'DELETE'} ${eventPath}`)
      break
    case 'rename':
      console.debug(`${'RENAME'} ${eventPath} => ${event.to}`)
      break
  }
}
