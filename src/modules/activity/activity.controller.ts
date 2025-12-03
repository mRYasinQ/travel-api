import type { RequestHandler } from 'express';

import createResponse from '../../common/helpers/createResponse';

import ActivityMessage from './activity.message';

const getActivitiesHandler: RequestHandler = async (_req, _res, next) => {
  try {
  } catch (error) {
    return next(error);
  }
};

const createActivityHandler: RequestHandler = async (_req, res, next) => {
  try {
    return createResponse(res, 'CREATED', ActivityMessage.CREATED);
  } catch (error) {
    return next(error);
  }
};

const updateActivityHandler: RequestHandler = async (_req, _res, next) => {
  try {
  } catch (error) {
    return next(error);
  }
};

const deleteActivityHandler: RequestHandler = async (_req, _res, next) => {
  try {
  } catch (error) {
    return next(error);
  }
};

export { getActivitiesHandler, createActivityHandler, updateActivityHandler, deleteActivityHandler };
