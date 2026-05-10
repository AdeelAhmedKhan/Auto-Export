import fs from "node:fs";
import { Pool } from "pg";

for (const line of fs.readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  const match = line.match(/^DATABASE_URL=(.*)$/);
  if (match) process.env.DATABASE_URL = match[1].replace(/^"|"$/g, "");
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not configured.");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

try {
  await pool.query("BEGIN");

  const result = await pool.query(`
    WITH numbered AS (
      SELECT id, 'st_' || row_number() OVER (ORDER BY id)::text AS stock_number
      FROM vehicles
    )
    UPDATE vehicles
    SET stock_number = numbered.stock_number,
        updated_at = now()
    FROM numbered
    WHERE vehicles.id = numbered.id
      AND vehicles.stock_number IS DISTINCT FROM numbered.stock_number
    RETURNING vehicles.id, vehicles.stock_number
  `);

  const duplicates = await pool.query(`
    SELECT stock_number, count(*)::int AS count
    FROM vehicles
    WHERE stock_number IS NOT NULL
    GROUP BY stock_number
    HAVING count(*) > 1
  `);

  if (duplicates.rowCount > 0) {
    throw new Error(`Duplicate stock numbers found after update: ${JSON.stringify(duplicates.rows)}`);
  }

  await pool.query("COMMIT");
  console.log(`Normalized ${result.rowCount} vehicle stock number${result.rowCount === 1 ? "" : "s"}.`);
} catch (error) {
  await pool.query("ROLLBACK");
  throw error;
} finally {
  await pool.end();
}
