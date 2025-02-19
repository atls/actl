import { writeFile } from 'fs/promises'
import esbuild       from 'esbuild'

const getGeneratedFileContent = (encodedContent: string): string => {
  const generatedFileContent = `// Auto-generated file
/* eslint-disable */
export const schematicFactoryCjsBase64 = "${encodedContent}";

export const writeSchematicFactory = async (path: string) => {
  const content = Buffer.from(schematicFactoryCjsBase64, "base64").toString("utf-8");
  const fs = await import('fs/promises')
  fs.writeFile(path, content);
};
`

  return generatedFileContent
}

export const esbuildBuildStep = async (): Promise<void> => {
  const result = await esbuild.build({
    logLevel: 'error',
    entryPoints: ['src/schematic/index.ts'],
    bundle: true,
    // packages: "external",
    // packages: "bundle",
    write: false,

    outfile: 'dist/schematic.cjs',
    outbase: 'src/schematic',
    format: 'cjs',
    platform: 'node',
    sourcemap: false,
    target: 'esnext',

    // external: [],

    plugins: [
      {
        name: 'yarn-pnp-resolver',
        setup(build): void {
          build.onResolve({ filter: /.*/ }, async (args) => {
            if (args.path.startsWith('.')) {
              // return { path: args.path, external: false };
              return { namespace: args.path, external: false }
            }

            if (
              args.path.startsWith('@angular-devkit/core') ||
              args.path.startsWith('@angular-devkit/schematics')
            ) {
              return { namespace: args.path, external: false }
            }

            return { path: args.path, external: true }
          })
        },
      },
    ],
  })

  const cjsContent = result.outputFiles[0].text
  const encodedContent = Buffer.from(cjsContent).toString('base64')

  const generatedFileContent = getGeneratedFileContent(encodedContent)

  await writeFile('src/generated/schematic-factory-export.ts', generatedFileContent)
}
