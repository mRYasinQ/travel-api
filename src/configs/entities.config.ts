import activityEntity from '../modules/activity/activity.entity';
import roleEntity, { roleRelations } from '../modules/role/role.entity';
import sessionEntity, { sessionRelations } from '../modules/session/session.entity';
import userEntity, { userRelations } from '../modules/user/user.entity';

const tables = {
  user: userEntity,
  session: sessionEntity,
  role: roleEntity,
  activity: activityEntity,
};

const relations = { userRelations, sessionRelations, roleRelations };

const entities = { ...tables, ...relations };

export { tables, relations };
export default entities;
