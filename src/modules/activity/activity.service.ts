import { count, eq } from 'drizzle-orm';

import db from '../../configs/db.config';

import CommonMessage from '../../common/constants/Message';
import UploadFolders from '../../common/constants/UploadFolders';
import { removeFile } from '../../common/helpers/upload';
import AppError from '../../common/utils/AppError';
import { getOrderByConfig } from '../../common/utils/filter';
import { createPaginationService, withPagination } from '../../common/utils/pagination';

import { ACTIVITY_ORDER_MAP } from './activity.constants';
import activityEntity from './activity.entity';
import ActivityMessage from './activity.message';
import type { ActivitiesQuery } from './activity.schema';
import type { UpdateActivityPayload } from './activity.types';

const getActivities = async (filterQuery: ActivitiesQuery) => {
  const { page, limit, order_by } = filterQuery;

  const orderExpressions = getOrderByConfig(order_by, ACTIVITY_ORDER_MAP);

  const query = db
    .select()
    .from(activityEntity)
    .orderBy(...orderExpressions)
    .$withCache();
  const dynamicQuery = query.$dynamic();

  const countQuery = db.select({ count: count() }).from(activityEntity).$withCache();
  const dataQuery = withPagination(dynamicQuery, page, limit);

  const [[{ count: total }], data] = await Promise.all([countQuery, dataQuery]);

  const pagination = createPaginationService(page, limit, total);

  return {
    data,
    pagination,
  };
};

const createActivity = async (name: string, image: string) => {
  await db.insert(activityEntity).values({ name, image });
  return;
};

const updateActivity = async (id: number, payload: UpdateActivityPayload) => {
  const activity = await db.query.activity.findFirst({ where: eq(activityEntity.id, id), columns: { image: true } });
  if (!activity) throw new AppError(ActivityMessage.NOT_FOUND, 'NOT_FOUND');

  const [{ affectedRows }] = await db.update(activityEntity).set(payload).where(eq(activityEntity.id, id));
  if (affectedRows === 0) throw new AppError(CommonMessage.NO_CHANGE_REQUIRED, 'OK');

  if (payload.image) void removeFile(UploadFolders.activity, activity.image);

  return;
};

const deleteActivity = async (id: number) => {
  const activity = await db.query.activity.findFirst({ where: eq(activityEntity.id, id), columns: { image: true } });
  if (!activity) throw new AppError(ActivityMessage.NOT_FOUND, 'NOT_FOUND');

  const [{ affectedRows }] = await db.delete(activityEntity).where(eq(activityEntity.id, id));
  if (affectedRows === 1) void removeFile(UploadFolders.activity, activity.image);

  return;
};

export { getActivities, createActivity, updateActivity, deleteActivity };
