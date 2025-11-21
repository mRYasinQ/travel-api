import bytes from 'bytes';
import multer, { type Multer } from 'multer';

import createStorage, { type StorageConfig } from '../configs/multer.config';

import CommonMessage from '../common/constants/Message';
import AppError from '../common/utils/AppError';

type UploadFileConfig = StorageConfig & {
  allowedFieldName: string;
  allowedMimeTypes: string[];
  size?: string;
};

const uploadFile = ({
  allowedFieldName,
  allowedMimeTypes,
  size = '1mb',
  ...storageConfig
}: UploadFileConfig): Multer => {
  const fileSize = bytes(size) as number;

  const multerConfig = multer({
    fileFilter: (_req, file, cb) => {
      const { fieldname, mimetype } = file;

      if (allowedFieldName !== fieldname) return cb(new AppError(CommonMessage.INVALID_FILE_FIELD, 'BAD_REQUEST'));

      const isAllowedMimType = allowedMimeTypes.includes(mimetype);
      if (!isAllowedMimType) return cb(new AppError(CommonMessage.INVALID_FILE_TYPE, 'BAD_REQUEST'));

      return cb(null, true);
    },
    storage: createStorage(storageConfig),
    limits: { fileSize },
  });

  return multerConfig;
};

export { UploadFileConfig };
export default uploadFile;
