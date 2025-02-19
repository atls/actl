/* eslint-disable @typescript-eslint/restrict-template-expressions, no-console, @typescript-eslint/no-deprecated */

import { UnsuccessfulWorkflowExecution } from '@angular-devkit/schematics'
import { NodeWorkflow }                  from '@angular-devkit/schematics/tools'

import { eventsLogHelper }               from './events-log.helper.js'

export const runSchematicHelper = async (
  schematicName: string,
  options: Record<string, string>
): Promise<0 | 1> => {
  const dryRun = false
  const debug = false
  let nothingDone = true

  const workflow = new NodeWorkflow(process.cwd(), {
    force: false,
    dryRun,
    resolvePaths: [process.cwd(), import.meta.dirname],
    packageManager: 'yarn',
  })

  workflow.reporter.subscribe((event) => {
    nothingDone = false
    eventsLogHelper(event)
  })

  try {
    await workflow
      .execute({
        collection: options.collectionPath,
        schematic: schematicName,
        options,
        allowPrivate: true,
        debug,
      })
      .toPromise()

    if (nothingDone) {
      console.info('Nothing to be done.')
    } else if (dryRun) {
      console.info('Dry run enabled. No files written to disk.')
    }

    return 0
  } catch (err) {
    if (err instanceof UnsuccessfulWorkflowExecution) {
      // "See above" because we already printed the error.
      console.debug('The Schematic workflow failed. See above.')
    } else if (debug && err instanceof Error) {
      console.debug(`An error occured:\n${err.stack}`)
    } else {
      console.debug(`Error: ${err instanceof Error ? err.message : err}`)
    }

    return 1
  }
}
