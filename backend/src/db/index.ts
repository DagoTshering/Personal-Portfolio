import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import * as schema from './schema.js';

dotenv.config();

const pool = new Pool({
  const connectionString = process.env.DATABASE_URL_MIGRATION ?? process.env.DATABASE_URL!,
});

export const db = drizzle(pool, { schema });

export { schema };
