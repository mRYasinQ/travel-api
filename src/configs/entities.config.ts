import activityEntity from '../modules/activity/activity.entity';
import sessionEntity, { sessionRelations } from '../modules/session/session.entity';
import userEntity, { userRelations } from '../modules/user/user.entity';

const tables = {
  user: userEntity,
  session: sessionEntity,
  activity: activityEntity,
};

const relations = { userRelations, sessionRelations };

const entities = { ...tables, ...relations };

export { tables, relations };
export default entities;
