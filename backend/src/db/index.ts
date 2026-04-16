import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import * as schema from './schema.js';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://portfolio:portfolio_secret@localhost:5432/portfolio',
});

export const db = drizzle(pool, { schema });

export { schema };
