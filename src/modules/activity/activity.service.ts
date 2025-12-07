import { count, eq } from 'drizzle-orm';

import db from '../../configs/db.config';

import UploadFolders from '../../common/constants/UploadFolders';
import { removeFile } from '../../common/helpers/upload';
import AppError from '../../common/utils/AppError';
import { createPaginationService, type PaginationData, withPagination } from '../../common/utils/pagination';

import activityEntity from './activity.entity';
import ActivityMessage from './activity.message';
import type { UpdateActivityPayload } from './activity.types';

type ActivitiesPayload = {
  pagination: PaginationData;
};

const getActivities = async ({ pagination: { page, limit } }: ActivitiesPayload) => {
  const query = db.select().from(activityEntity).$withCache();
  const dynamicQuery = query.$dynamic();

  const countQuery = db.select({ count: count() }).from(activityEntity).$withCache();
  const dataQuery = withPagination(dynamicQuery, page, limit);

  const [[{ count: total }], data] = await Promise.all([countQuery, dataQuery]);

  const pagiantion = createPaginationService(page, limit, total);

  return {
    data,
    pagiantion,
  };
};

const getActivity = async (id: number) => {
  const activity = await db.query.activity.findFirst({
    where: eq(activityEntity.id, id),
  });
  if (!activity) throw new AppError(ActivityMessage.NOT_FOUND, 'NOT_FOUND');

  return activity;
};

const createActivity = async (name: string, image: string) => {
  await db.insert(activityEntity).values({ name, image });
  return;
};

const updateActivity = async (id: number, payload: UpdateActivityPayload) => {
  const activity = await getActivity(id);

  const [{ affectedRows }] = await db.update(activityEntity).set(payload).where(eq(activityEntity.id, activity.id));
  if (affectedRows === 0) throw new AppError(ActivityMessage.NO_CHANGE_REQUIRED, 'OK');

  if (payload.image) void removeFile(UploadFolders.activity, activity.image);

  return;
};

const deleteActivity = async (id: number) => {
  const activity = await getActivity(id);

  const [{ affectedRows }] = await db.delete(activityEntity).where(eq(activityEntity.id, activity.id));
  if (affectedRows === 0) return;

  void removeFile(UploadFolders.activity, activity.image);

  return;
};

export { getActivities, createActivity, updateActivity, deleteActivity };
