import type { BaseCommand }   from '@yarnpkg/cli'
import type { Configuration } from '@yarnpkg/core'
import type { StreamReport }  from '@yarnpkg/core'

type StreamReportOptionsType = Parameters<typeof StreamReport.start>[0]

export const getStreamReportOptions = (
  command: BaseCommand,
  configuration: Configuration
): StreamReportOptionsType => {
  const streamReportOptions = {
    stdout: command.context.stdout,
    configuration,
  }

  return streamReportOptions
}
