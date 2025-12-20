import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';

import swaggerDocs from './configs/swagger.config';

import activityRouter from './modules/activity/activity.routes';
import authRouter from './modules/auth/auth.routes';
import roleRouter from './modules/role/role.routes';
import sessionRouter from './modules/session/session.routes';
import userRouter from './modules/user/user.routes';

const appRouter = Router();

appRouter.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

appRouter.use('/auth', authRouter);
appRouter.use('/user', userRouter);
appRouter.use('/session', sessionRouter);
appRouter.use('/role', roleRouter);

appRouter.use('/activity', activityRouter);

export default appRouter;
