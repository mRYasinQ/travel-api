import type { Request } from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';

import logger from '../../configs/logger.config';

import UploadFolders from '../constants/UploadFolders';
import getErrorMessage from '../utils/getErrorMessage';

type Keys = keyof typeof UploadFolders;
type Direction = (typeof UploadFolders)[Keys];

const STATIC_PATH = path.join(process.cwd(), 'public');

const removeFile = async (direction: Direction, fileName: string) => {
  try {
    const filePath = path.join(STATIC_PATH, UploadFolders.base, direction, fileName);
    await fs.rm(filePath, { force: true });
  } catch (error) {
    logger.error(`Failed to remove file "${fileName}" from directory "${direction}". Error: ${getErrorMessage(error)}`);
  }
};

const cleanupFiles = async (req: Request) => {
  try {
    if (req.file) await fs.unlink(req.file.path);

    if (req.files) {
      if (Array.isArray(req.files)) {
        await Promise.all(req.files.map((file) => fs.unlink(file.path)));
        return;
      }

      const fileArrays = Object.values(req.files);
      await Promise.all(fileArrays.flat().map((file) => fs.unlink(file.path)));
    }
  } catch (error) {
    logger.error(`Failed to clean up temporary upload files, Error: ${getErrorMessage(error)}`);
  }
};

export { removeFile, cleanupFiles };
