import { createRequire } from 'node:module'
import { dirname }       from 'node:path'
import { join }          from 'node:path'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)

const PACKAGE_NAME = '@atls/code-runtime/collection'

const findPnpApiPath = (cwd = process.cwd()): string => {
  if (process.versions.pnp) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
    return require('module')
      .findPnpApi(fileURLToPath(import.meta.url))
      .resolveRequest('pnpapi', null)
  }

  return join(cwd, '.pnp.cjs')
}

const setupPnp = async (cwd = process.cwd()): Promise<void> => {
  const pnpPath = findPnpApiPath(cwd)
  const { default: pnp } = await import(pnpPath)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  pnp.setup()
}

export const resolveSchematics = async (cwd = process.cwd()): Promise<string> => {
  try {
    return join(dirname(require.resolve(PACKAGE_NAME)))
  } catch {
    await setupPnp(cwd)
    return join(dirname(require.resolve(PACKAGE_NAME)))
  }
}

export const getCollectionPath = async (): Promise<string> => {
  const packagePath = await resolveSchematics(process.cwd())
  const collectionPath = join(packagePath, 'collection.json')
  return collectionPath
}
