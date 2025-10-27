import path from 'path';
import swaggerJsDoc, { type OAS3Definition, type Options } from 'swagger-jsdoc';

const BASE_URL = process.env.BASE_URL;

const swaggerDefinition: OAS3Definition = {
  openapi: '3.0.1',
  info: {
    title: 'Travel API',
    description: 'A Platform for Sharing Travel Experiences.',
    contact: {
      name: 'Yasin Abbasi',
      email: 'yasinabbasi.y20@gmail.com',
      url: 'https://mryasinq.ir',
    },
    version: '1.0.0',
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
      },
    },
  },
  security: [{ bearerAuth: [] }],
  servers: [{ url: BASE_URL }],
};

const swaggerOptions: Options = {
  definition: swaggerDefinition,
  apis: [path.join(process.cwd(), '{src,dist}/modules/**/*.swagger.{js,ts}')],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export default swaggerDocs;
