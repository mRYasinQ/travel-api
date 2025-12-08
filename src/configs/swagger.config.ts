import path from 'node:path';
import swaggerJsDoc, { type OAS3Definition, type Options } from 'swagger-jsdoc';

const { BASE_URL } = process.env;

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
  servers: [{ url: BASE_URL }],
};

const swaggerOptions: Options = {
  definition: swaggerDefinition,
  apis: [
    path.join(process.cwd(), '{src,dist}/app.swagger.yml'),
    path.join(process.cwd(), '{src,dist}/modules/**/*.swagger.yml'),
  ],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export default swaggerDocs;
