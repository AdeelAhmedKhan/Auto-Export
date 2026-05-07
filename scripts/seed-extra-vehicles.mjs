/**
 * Add extra demo vehicles without deleting or replacing existing inventory.
 * Requires DATABASE_URL in .env.local or .env.
 *
 * Run: node scripts/seed-extra-vehicles.mjs
 */
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import pg from "pg";

function loadEnv() {
  for (const file of [".env.local", ".env"]) {
    const path = join(process.cwd(), file);
    if (!existsSync(path)) continue;

    for (const line of readFileSync(path, "utf8").split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;

      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = value;
    }
  }
}

loadEnv();

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("Set DATABASE_URL in .env.local or .env.");
  process.exit(1);
}

const images = [
  "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200&q=80",
  "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&q=80",
  "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&q=80",
  "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&q=80",
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80",
  "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1200&q=80",
  "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=1200&q=80",
  "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&q=80",
];

const makes = [
  ["Toyota", "toyota"],
  ["Ford", "ford"],
  ["Mitsubishi", "mitsubishi"],
  ["Isuzu", "isuzu"],
  ["Nissan", "nissan"],
  ["Honda", "honda"],
  ["Mazda", "mazda"],
  ["BMW", "bmw"],
];

const bodyTypes = [
  ["Double Cab", "double-cab"],
  ["Standard Cab", "standard-cab"],
  ["SUV", "suv"],
  ["Van", "van"],
  ["Wagon", "wagon"],
];

const models = [
  ["toyota", "Hilux", "hilux"],
  ["toyota", "Fortuner", "fortuner"],
  ["toyota", "Hiace", "hiace"],
  ["toyota", "Corolla Cross", "corolla-cross"],
  ["ford", "Ranger", "ranger"],
  ["ford", "Everest", "everest"],
  ["mitsubishi", "Triton", "triton"],
  ["mitsubishi", "Pajero Sport", "pajero-sport"],
  ["isuzu", "D-Max", "d-max"],
  ["nissan", "Navara", "navara"],
  ["nissan", "X-Trail", "x-trail"],
  ["honda", "CR-V", "cr-v"],
  ["honda", "Vezel", "vezel"],
  ["mazda", "CX-5", "cx-5"],
  ["bmw", "X3", "x3"],
];

const templates = [
  ["toyota", "hilux", "double-cab", "TOYOTA HILUX REVO DOUBLE CAB", "Diesel", "Automatic", 2755, "4WD"],
  ["ford", "ranger", "double-cab", "FORD RANGER XLT DOUBLE CAB", "Diesel", "Automatic", 1996, "4WD"],
  ["mitsubishi", "triton", "double-cab", "MITSUBISHI TRITON GLS DOUBLE CAB", "Diesel", "Manual", 2442, "4WD"],
  ["isuzu", "d-max", "double-cab", "ISUZU D-MAX HI-LANDER", "Diesel", "Automatic", 1898, "2WD"],
  ["nissan", "navara", "double-cab", "NISSAN NAVARA PRO-4X", "Diesel", "Automatic", 2298, "4WD"],
  ["toyota", "fortuner", "suv", "TOYOTA FORTUNER SIGMA 4", "Diesel", "Automatic", 2755, "4WD"],
  ["ford", "everest", "suv", "FORD EVEREST TITANIUM", "Diesel", "Automatic", 1996, "4WD"],
  ["mitsubishi", "pajero-sport", "suv", "MITSUBISHI PAJERO SPORT", "Diesel", "Automatic", 2442, "4WD"],
  ["honda", "cr-v", "suv", "HONDA CR-V TURBO", "Petrol", "Automatic", 1498, "2WD"],
  ["mazda", "cx-5", "suv", "MAZDA CX-5 XD PROACTIVE", "Diesel", "Automatic", 2188, "2WD"],
  ["bmw", "x3", "suv", "BMW X3 XDRIVE20D", "Diesel", "Automatic", 1995, "4WD"],
  ["toyota", "hiace", "van", "TOYOTA HIACE GL COMMUTER", "Diesel", "Automatic", 2755, "2WD"],
  ["nissan", "x-trail", "wagon", "NISSAN X-TRAIL HYBRID", "Hybrid", "Automatic", 1997, "4WD"],
  ["honda", "vezel", "wagon", "HONDA VEZEL HYBRID Z", "Hybrid", "Automatic", 1496, "2WD"],
  ["toyota", "corolla-cross", "wagon", "TOYOTA COROLLA CROSS HYBRID", "Hybrid", "Automatic", 1798, "2WD"],
];

const colors = ["White", "Black", "Silver", "Grey", "Blue", "Red", "Pearl", "Dark Grey"];
const features = ["ABS", "Airbag", "A/C", "Power Window", "Back Camera", "Alloy Wheels"];

async function main() {
  const pool = new pg.Pool({ connectionString: url, max: 2 });
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    for (const [name, slug] of makes) {
      await client.query(
        `INSERT INTO makes (name, slug, is_active)
         VALUES ($1, $2, true)
         ON CONFLICT (slug) DO NOTHING`,
        [name, slug]
      );
    }

    for (const [name, slug] of bodyTypes) {
      await client.query(
        `INSERT INTO body_types (name, slug)
         VALUES ($1, $2)
         ON CONFLICT (slug) DO NOTHING`,
        [name, slug]
      );
    }

    for (const [makeSlug, name, slug] of models) {
      await client.query(
        `INSERT INTO models (make_id, name, slug, is_active)
         SELECT makes.id, $2::varchar, $3::varchar, true
         FROM makes
         WHERE makes.slug = $1
         AND NOT EXISTS (
           SELECT 1
           FROM models
           JOIN makes mk ON mk.id = models.make_id
           WHERE mk.slug = $1 AND models.slug = $3
         )`,
        [makeSlug, name, slug]
      );
    }

    const insertVehicle = `
      INSERT INTO vehicles (
        stock_number, make_id, model_id, body_type_id, title, year, month, price, mileage,
        fuel_type, transmission, steering, engine_cc, color, drive_type, condition,
        description, is_active, is_featured, is_clearance, location
      )
      SELECT
        $1::varchar, mk.id, mo.id, bt.id, $2::varchar, $3::int, $4::int, $5::numeric, $6::int,
        $7::varchar, $8::varchar, 'Right', $9::int, $10::varchar, $11::varchar, $12::varchar,
        $13::text, true, $14::bool, $15::bool, $16::varchar
      FROM makes mk
      JOIN models mo ON mo.make_id = mk.id AND mo.slug = $18::varchar
      JOIN body_types bt ON bt.slug = $19::varchar
      WHERE mk.slug = $17::varchar
      ON CONFLICT (stock_number) DO NOTHING
      RETURNING id
    `;

    let inserted = 0;
    for (let i = 0; i < 80; i++) {
      const template = templates[i % templates.length];
      const [makeSlug, modelSlug, bodySlug, name, fuel, transmission, engineCc, drive] = template;
      const stock = `AE-X${String(i + 1).padStart(3, "0")}`;
      const year = 2017 + (i % 8);
      const month = (i % 12) + 1;
      const price = 9800 + i * 875 + (i % 5) * 450;
      const mileage = i % 7 === 0 ? 500 + i * 120 : 12000 + i * 3900;
      const condition = year >= 2024 || mileage < 2000 ? "brand_new" : "used";
      const title = `${year} ${name}`;
      const isFeatured = i % 6 === 0;
      const isClearance = i % 9 === 0;
      const color = colors[i % colors.length];

      const result = await client.query(insertVehicle, [
        stock,
        title,
        year,
        month,
        price,
        mileage,
        fuel,
        transmission,
        engineCc,
        color,
        drive,
        condition,
        "<p>Fresh demo inventory added for catalog layout and pagination testing.</p>",
        isFeatured,
        isClearance,
        i % 2 === 0 ? "Thailand Yard" : "Japan Yard",
        makeSlug,
        modelSlug,
        bodySlug,
      ]);

      const vehicleId = result.rows[0]?.id;
      if (!vehicleId) continue;

      inserted++;
      for (const feature of features.slice(0, 4 + (i % 3))) {
        await client.query(
          `INSERT INTO vehicle_features (vehicle_id, feature) VALUES ($1, $2)`,
          [vehicleId, feature]
        );
      }

      await client.query(
        `INSERT INTO vehicle_images (vehicle_id, url, sort_order, is_primary)
         VALUES ($1, $2, 0, true), ($1, $3, 1, false)`,
        [vehicleId, images[i % images.length], images[(i + 2) % images.length]]
      );
    }

    await client.query("COMMIT");
    console.log(`Extra vehicle seed complete. Inserted ${inserted} new vehicles.`);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
