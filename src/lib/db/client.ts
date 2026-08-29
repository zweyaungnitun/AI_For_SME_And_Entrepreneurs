import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import { dbConfigured } from "@/lib/config";

type Sql = NeonQueryFunction<false, false>;

let sql: Sql | null = null;

export { dbConfigured };

export function getSql(): Sql {
  if (!dbConfigured()) {
    throw new Error("DATABASE_URL is not set");
  }
  if (!sql) sql = neon(process.env.DATABASE_URL as string);
  return sql;
}
