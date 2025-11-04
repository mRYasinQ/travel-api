import sessionEntity, { sessionRelations } from '../modules/session/session.entity';
import userEntity, { userRelations } from '../modules/user/user.entity';

const entities = {
  user: userEntity,
  userRelations,
  session: sessionEntity,
  sessionRelations,
};

export default entities;
