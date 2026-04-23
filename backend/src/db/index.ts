import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import * as schema from './schema.js';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL_MIGRATION || process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL (or DATABASE_URL_MIGRATION) is required');
}

const pool = new Pool({
  connectionString: databaseUrl,
});

export const db = drizzle(pool, { schema });

export { schema };
