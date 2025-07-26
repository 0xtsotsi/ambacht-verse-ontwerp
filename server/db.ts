import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Only require DATABASE_URL in production or when explicitly needed
const databaseUrl = process.env.DATABASE_URL || "postgresql://localhost:5432/placeholder";

export const pool = new Pool({ connectionString: databaseUrl });
export const db = drizzle({ client: pool, schema });
