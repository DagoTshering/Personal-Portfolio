import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL_MIGRATION || process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL (or DATABASE_URL_MIGRATION) is required for migrations');
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
