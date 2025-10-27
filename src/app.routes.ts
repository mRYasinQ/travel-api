import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';

import swaggerDocs from './configs/swagger.config';

import authRouter from './modules/auth/auth.routes';

const appRouter = Router();

appRouter.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

appRouter.use('/auth', authRouter);

export default appRouter;
