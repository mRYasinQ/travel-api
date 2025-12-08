import { getUploadUrlFile } from '../../common/helpers/upload';

import activityEntity from './activity.entity';

type ActivityData = typeof activityEntity.$inferSelect;

const toActivityResponse = ({ id, name, image, createdAt }: ActivityData) => {
  return {
    id,
    name,
    image: getUploadUrlFile('activities', image),
    created_at: createdAt,
  };
};

const toActivitiesResponse = (activities: ActivityData[]) => {
  return activities.map((activity) => toActivityResponse(activity));
};

export { toActivityResponse, toActivitiesResponse };
