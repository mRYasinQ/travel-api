import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';

import swaggerDocs from './configs/swagger.config';

const appRouter = Router();

appRouter.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

export default appRouter;
