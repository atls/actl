import { updateTsConfigInTree } from '../utils/tsconfig.utils.js'

export const updateTsConfigRule = async (): Promise<ReturnType<typeof updateTsConfigInTree>> => {
  const { tsConfig } = await import('@atls/code-runtime')
  return updateTsConfigInTree({
    ...tsConfig.compilerOptions,
  })
}
