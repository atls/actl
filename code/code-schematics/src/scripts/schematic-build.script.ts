/* eslint-disable no-await-in-loop */

import { readdir }   from 'fs/promises'
import { mkdir }     from 'fs/promises'
import { writeFile } from 'fs/promises'
import { readFile }  from 'fs/promises'
import { join }      from 'path'
import { dirname }   from 'path'

type FileStructure = {
  [key: string]: FileStructure | string
}

async function buildFileStructure(dirPath: string): Promise<FileStructure> {
  const result: FileStructure = {}
  const entries = await readdir(dirPath, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = join(dirPath, entry.name)

    if (entry.isDirectory()) {
      result[entry.name] = await buildFileStructure(fullPath)
    } else {
      const content = await readFile(fullPath, 'utf-8')
      result[entry.name] = Buffer.from(content).toString('base64')
    }
  }

  return result
}

function generateModuleContent(structure: FileStructure): string {
  const createStructureCode = (obj: FileStructure, indent = ''): string => {
    let code = ''
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        code += `${indent}'${key}': '${value}',\n`
      } else {
        code += `${indent}'${key}': {\n`
        code += createStructureCode(value, `${indent}  `)
        code += `${indent}},\n`
      }
    }
    return code
  }

  return `// Auto-generated file
/* eslint-disable */
export const assetsStructure = {
${createStructureCode(structure, '  ')}
}

export async function writeFiles(baseDir: string) {
  const { join } = await import('path')
  const { mkdir, writeFile } = await import('fs/promises')

  async function writeRecursive(obj: any, currentPath: string) {
    for (const [key, value] of Object.entries(obj)) {
      const fullPath = join(currentPath, key)

      if (typeof value === 'string') {
        await writeFile(
          fullPath, 
          Buffer.from(value, 'base64').toString('utf-8')
        )
      } else {
        await mkdir(fullPath, { recursive: true })
        await writeRecursive(value, fullPath)
      }
    }
  }

  await writeRecursive(assetsStructure, baseDir)
}
`
}

export async function generateSchematic(schematicDir: string, outputFile: string): Promise<void> {
  const structure = await buildFileStructure(schematicDir)
  const moduleContent = generateModuleContent(structure)

  await mkdir(dirname(outputFile), { recursive: true })
  await writeFile(outputFile, moduleContent)
}
