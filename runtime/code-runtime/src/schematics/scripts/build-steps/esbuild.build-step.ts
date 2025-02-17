import { extname } from 'path'
import esbuild     from 'esbuild'

type MainBuildPartProps = {
  allFiles: Array<string>
  outDir: string
}

export const esbuildBuildStep = async ({ allFiles, outDir }: MainBuildPartProps): Promise<void> => {
  const tsJsFiles = allFiles.filter((file) => ['.ts', '.js'].includes(extname(file)))

  await esbuild.build({
    logLevel: 'error',
    entryPoints: tsJsFiles,
    outdir: outDir,
    outbase: 'src/schematics/schematic',
    format: 'cjs',
    platform: 'node',
    sourcemap: false,
    target: 'esnext',
  })
}
