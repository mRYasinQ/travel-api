import { Router } from 'express';

import UploadFolders from '../../common/constants/UploadFolders';

import checkAuth from '../../middlewares/checkAuth.middleware';
import uploadFile from '../../middlewares/uploadFile.middleware';
import { validationBody, validationParams, validationQuery } from '../../middlewares/validation.middleware';

import {
  createActivityHandler,
  deleteActivityHandler,
  getActivitiesHandler,
  updateActivityHandler,
} from './activity.controller';
import {
  activitiesQuerySchema,
  activityParamSchema,
  createActivitySchema,
  updateActivitySchema,
} from './activity.schema';

const { ACTIVITY_FILE_SIZE } = process.env;
const UPLOAD_IMAGE_FILED = 'image';
const UPLOAD_IMAGE_PREFIX = 'activity';

const uploadActivityImage = uploadFile({
  allowedFieldName: UPLOAD_IMAGE_FILED,
  allowedMimeTypes: ['image/png', 'image/jpeg'],
  basePath: UploadFolders.activity,
  filePrefix: UPLOAD_IMAGE_PREFIX,
  size: ACTIVITY_FILE_SIZE,
}).single(UPLOAD_IMAGE_FILED);

const activityRouter = Router();

activityRouter.get('/', validationQuery(activitiesQuerySchema), getActivitiesHandler);

activityRouter.use(checkAuth());
activityRouter.post('/', uploadActivityImage, validationBody(createActivitySchema), createActivityHandler);
activityRouter.patch(
  '/:id',
  uploadActivityImage,
  validationParams(activityParamSchema),
  validationBody(updateActivitySchema),
  updateActivityHandler,
);
activityRouter.delete('/:id', validationParams(activityParamSchema), deleteActivityHandler);

export default activityRouter;
