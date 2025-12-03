import { Router } from 'express';

import UploadFolders from '../../common/constants/UploadFolders';

import uploadFile from '../../middlewares/uploadFile.middleware';
import { validationBody } from '../../middlewares/validation.middleware';

import {
  createActivityHandler,
  deleteActivityHandler,
  getActivitiesHandler,
  updateActivityHandler,
} from './activity.controller';
import { createActivitySchema } from './activity.schema';

const { ACTIVITY_FILE_SIZE } = process.env;
const UPLOAD_IMAGE_FILED = 'image';
const UPLOAD_IMAGE_PREFIX = 'activty';

const uploadActivityImage = uploadFile({
  allowedFieldName: UPLOAD_IMAGE_FILED,
  allowedMimeTypes: ['image/png', 'image/jpeg'],
  basePath: UploadFolders.activity,
  filePrefix: UPLOAD_IMAGE_PREFIX,
  size: ACTIVITY_FILE_SIZE,
}).single(UPLOAD_IMAGE_FILED);

const activityRouter = Router();

activityRouter.get('/', getActivitiesHandler);
activityRouter.post('/', uploadActivityImage, validationBody(createActivitySchema), createActivityHandler);

activityRouter.patch('/:id', updateActivityHandler);
activityRouter.delete('/:id', deleteActivityHandler);

export default activityRouter;
