import { Command } from 'clipanion'
import execa from 'execa'
import { existsSync } from 'fs'
import { join } from 'path'
import { getChangedPackages } from '@atlantis-lab/actl-build/lib/lerna'
import { getPullFiles, getBranchName } from '../github'

interface Package {
  location: string
  name: string
}

const event = process.env.GITHUB_EVENT_PATH ? require(process.env.GITHUB_EVENT_PATH) : {}

export default class BuildCommand extends Command {
  // static description: string = 'Publish release'
  // static examples: string[] = ['$ actl release:publish']
  // static strict: boolean = false

  static paths = [['release:publish']]

  async execute(): Promise<void> {
    const files = await getPullFiles()
    const branch = getBranchName()
    const packages = await getChangedPackages(files)
    const sha = (event.after || event.pull_request.head.sha || process.env.GITHUB_SHA).substr(0, 7)
    const version = `${branch}-${sha}`
    const commands = []
    const withImages = packages.filter((pkg: Package) =>
      existsSync(join(pkg.location, 'Dockerfile')),
    )

    withImages.forEach((pkg: Package) => {
      const dockerfile = join(pkg.location, 'Dockerfile').replace(`${process.cwd()}/`, '')
      const name = pkg.name.replace(/@/g, '').replace(/\//, '-')
      const repo = `${process.env.REGISTRY_URL}${name}`
      commands.push({ repo, dockerfile })
    })

    try {
      for (const command of commands) {
        await execa(
          'docker',
          [
            'build',
            '-t',
            `${command.repo}:${version}`,
            '-t',
            `${command.repo}:latest`,
            '--file',
            command.dockerfile,
            '.',
          ],
          { stdio: 'inherit' },
        )
      }

      for (const command of commands) {
        await execa('docker', ['push', `${command.repo}:${version}`], {
          stdio: 'inherit',
        })
      }

      for (const command of commands) {
        await execa('docker', ['push', `${command.repo}:latest`], {
          stdio: 'inherit',
        })
      }
    } catch (error) {
      this.context.stdout.write(`${error}`)
    }
  }
}
