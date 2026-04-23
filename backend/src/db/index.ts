import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import * as schema from './schema.js';

dotenv.config();

const nodeEnv = process.env.NODE_ENV || 'development';
const databaseUrl = nodeEnv === 'production'
  ? process.env.DATABASE_URL_PRODUCTION
  : process.env.DATABASE_URL_DEVELOPMENT;

if (!databaseUrl) {
  throw new Error('Database URL is required. Set DATABASE_URL_DEVELOPMENT (dev) or DATABASE_URL_PRODUCTION (prod).');
}

const pool = new Pool({
  connectionString: databaseUrl,
});

export const db = drizzle(pool, { schema });

export { schema };
