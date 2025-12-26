import { Router } from 'express';

import UploadFolders from '../../common/constants/UploadFolders';

import { checkAuth, checkPermissions } from '../../middlewares/auth.middleware';
import processImage from '../../middlewares/processImage.middleware';
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

const requireAuth = checkAuth();
const optionalAuth = checkAuth(true);

activityRouter.get(
  '/',
  optionalAuth,
  checkPermissions('SHOW_ACTIVITY'),
  validationQuery(activitiesQuerySchema),
  getActivitiesHandler,
);
activityRouter.post(
  '/',
  requireAuth,
  checkPermissions('CREATE_ACTIVITY'),
  uploadActivityImage,
  processImage,
  validationBody(createActivitySchema),
  createActivityHandler,
);

activityRouter.patch(
  '/:id',
  requireAuth,
  checkPermissions('UPDATE_ACTIVITY'),
  uploadActivityImage,
  processImage,
  validationParams(activityParamSchema),
  validationBody(updateActivitySchema),
  updateActivityHandler,
);
activityRouter.delete(
  '/:id',
  requireAuth,
  checkPermissions('DELETE_ACTIVITY'),
  validationParams(activityParamSchema),
  deleteActivityHandler,
);

export default activityRouter;
