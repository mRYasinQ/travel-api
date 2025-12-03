import type { Request } from 'express';
import fs from 'node:fs/promises';

import logger from '../../configs/logger.config';

import getErrorMessage from '../utils/getErrorMessage';

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
    logger.error(`Error cleaning up uploaded files, Error: ${getErrorMessage(error)}`);
  }
};

export default cleanupFiles;
