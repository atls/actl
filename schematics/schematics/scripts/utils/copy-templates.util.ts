/* eslint-disable n/no-sync */

import { copyFileSync } from "fs";
import { extname } from "path";
import { relative } from "path";
import { join } from "path";

import { ensureDirStructureUtil } from "../utils/index.js";
import { checkTemplateFileUtil } from "../utils/index.js";
import { CopyTemplatesError } from "../errors/index.js";

interface CopyTemplatesUtilProps {
  srcDir: string;
  outDir: string;
  allFiles: Array<string>;
}

export const copyTemplatesUtil = ({
  srcDir,
  outDir,
  allFiles,
}: CopyTemplatesUtilProps): void => {
  try {
    allFiles.forEach((file) => {
      const isTemplate = checkTemplateFileUtil(srcDir, file);
      if (extname(file) === ".json" || isTemplate) {
        const relativePath = relative(srcDir, file);
        const destPath = join(outDir, relativePath);
        ensureDirStructureUtil(destPath);
        copyFileSync(file, destPath);
      }
    });
  } catch {
    throw new CopyTemplatesError();
  }
};
