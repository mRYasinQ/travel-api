import type { RequestHandler } from 'express';

import createResponse from '../../common/helpers/createResponse';
import AppError from '../../common/utils/AppError';
import { getPaginationData } from '../../common/utils/pagination';

import { toActivitiesResponse } from './activity.mapper';
import ActivityMessage from './activity.message';
import type { ActivityParam, CreateActivity, UpdateActivity } from './activity.schema';
import { createActivity, deleteActivity, getActivities, updateActivity } from './activity.service';
import type { UpdateActivityPayload } from './activity.types';

const getActivitiesHandler: RequestHandler = async (req, res, next) => {
  try {
    const paginationData = getPaginationData(req);

    const { data, pagiantion } = await getActivities({ pagination: paginationData });

    return createResponse(res, 'OK', ActivityMessage.ACTIVITY_RETRIEVED, toActivitiesResponse(data), false, {
      pagiantion,
    });
  } catch (error) {
    return next(error);
  }
};

const createActivityHandler: RequestHandler = async (req, res, next) => {
  try {
    const { name } = req.validatedBody as CreateActivity;
    const fileName = req.file?.filename;

    if (!fileName) throw new AppError(ActivityMessage.IMAGE_REQUIRED, 'BAD_REQUEST');

    await createActivity(name, fileName);

    return createResponse(res, 'CREATED', ActivityMessage.ACTIVITY_CREATED);
  } catch (error) {
    return next(error);
  }
};

const updateActivityHandler: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.validatedParams as ActivityParam;
    const body = req.validatedBody as UpdateActivity;
    const image = req.file?.filename;

    const payload: UpdateActivityPayload = { ...body };
    if (image) payload.image = image;

    if (Object.keys(payload).length === 0) throw new AppError(ActivityMessage.PAYLOAD_EMPTY, 'BAD_REQUEST');

    await updateActivity(id, payload);

    return createResponse(res, 'OK', ActivityMessage.ACTIVITY_UPDATED);
  } catch (error) {
    return next(error);
  }
};

const deleteActivityHandler: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.validatedParams as ActivityParam;

    await deleteActivity(id);

    return createResponse(res, 'OK', ActivityMessage.ACTIVITY_DELETED);
  } catch (error) {
    return next(error);
  }
};

export { getActivitiesHandler, createActivityHandler, updateActivityHandler, deleteActivityHandler };
