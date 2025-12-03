import { diskStorage, type StorageEngine } from 'multer';
import fs from 'node:fs/promises';
import path from 'node:path';

import { generateRandomBytes, md5 } from '../common/utils/random';

type StorageConfig = {
  basePath: string;
  filePrefix?: string;
};

const createStorage = ({ basePath, filePrefix }: StorageConfig): StorageEngine => {
  const storage = diskStorage({
    destination: async (_req, _file, cb) => {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', basePath);

      try {
        await fs.mkdir(uploadDir, { recursive: true });

        return cb(null, uploadDir);
      } catch (error) {
        return cb(error as Error, uploadDir);
      }
    },
    filename: (_req, file, cb) => {
      const { originalname } = file;

      const extName = path.extname(originalname);
      const uniqueFileName = (md5(new Date() + generateRandomBytes(16, 'hex')) + extName).toLowerCase();
      const fileName = filePrefix ? `${filePrefix}_${uniqueFileName}` : uniqueFileName;

      return cb(null, fileName);
    },
  });

  return storage;
};

export { StorageConfig };
export default createStorage;
