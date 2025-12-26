import type { RequestHandler } from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

import logger from '../configs/logger.config';

import getErrorMessage from '../common/utils/getErrorMessage';

type MulterFile = Express.Multer.File;

const allowedMimeTypes = ['image/png', 'image/jpeg'];

const minifyImage = async (file: MulterFile): Promise<MulterFile> => {
  const { path: filePath, destination, mimetype } = file;

  if (!allowedMimeTypes.includes(mimetype)) return file;

  const fileName = path.basename(filePath, path.extname(filePath));
  const newFileName = `${fileName}.webp`;
  const outPutFilePath = path.join(destination, newFileName);

  sharp.cache(false);
  await sharp(filePath).webp({ quality: 80, effort: 4 }).toFile(outPutFilePath);

  try {
    await fs.unlink(filePath);
  } catch (error) {
    logger.error(`Failed to delete temporary upload file: ${filePath}, Error: ${getErrorMessage(error)}`);
  }

  file.mimetype = 'image/webp';
  file.filename = newFileName;
  file.path = outPutFilePath;

  return file;
};

const processImage: RequestHandler = async (req, _res, next) => {
  try {
    if (req.file) req.file = await minifyImage(req.file);

    if (req.files) {
      if (Array.isArray(req.files)) {
        req.files = await Promise.all(req.files.map((file) => minifyImage(file)));
      } else {
        const updatedFiles: Record<string, MulterFile[]> = {};
        for (const [key, files] of Object.entries(req.files)) {
          updatedFiles[key] = await Promise.all(files.map((file) => minifyImage(file)));
        }
        req.files = updatedFiles;
      }
    }

    return next();
  } catch (error) {
    return next(error);
  }
};

export default processImage;
