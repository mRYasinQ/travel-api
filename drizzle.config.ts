import { defineConfig } from 'drizzle-kit';

const drizzleKitConfig = defineConfig({
  dialect: 'mysql',
  schema: ['./src/modules/**/*.entity.ts', './dist/modules/**/*.entity.js'],
  out: './drizzle',
  dbCredentials: {
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME!,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
});

export default drizzleKitConfig;
