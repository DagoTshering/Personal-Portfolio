import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv';

dotenv.config();

const nodeEnv = process.env.NODE_ENV || 'development';
const databaseUrl = nodeEnv === 'production'
  ? (process.env.DATABASE_URL_PRODUCTION || "postgresql://postgres:devpass@db:5432/portfolio")
  : (process.env.DATABASE_URL_DEVELOPMENT || "postgresql://portfolio:devpass@localhost:5435/portfolio");

if (!databaseUrl) {
  throw new Error('Database URL is required for migrations. Set DATABASE_URL_DEVELOPMENT (dev) or DATABASE_URL_PRODUCTION (prod).');
}

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: databaseUrl,
  },
  verbose: true,
  strict: true,
});
