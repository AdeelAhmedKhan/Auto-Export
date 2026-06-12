import { sql } from "drizzle-orm";
import { db } from "@/lib/db";

const requiredCatalogSql = sql`
  INSERT INTO makes (name, slug, is_active)
  VALUES
    ('MG', 'mg', true),
    ('Champ', 'champ', true)
  ON CONFLICT (slug) DO NOTHING;

  INSERT INTO models (make_id, name, slug, is_active)
  SELECT m.id, 'Commuter', 'commuter', true
  FROM makes m
  WHERE m.slug = 'toyota'
    AND NOT EXISTS (
      SELECT 1 FROM models mo WHERE mo.make_id = m.id AND mo.slug = 'commuter'
    );
`;

export async function ensureRequiredVehicleCatalog() {
  if (!db) return;
  await db.execute(requiredCatalogSql);
}
