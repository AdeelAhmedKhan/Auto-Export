import { and, eq, ilike } from "drizzle-orm";
import { db } from "@/lib/db";
import { bodyTypes, makes, models } from "@/lib/db/schema";

function slugify(value: string) {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "option";
}

function positiveId(value: string | null | undefined) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

async function resolveMakeId(makeIdValue: string | null | undefined, makeNameValue: string) {
  if (!db) return null;

  const name = makeNameValue.trim();
  const selectedId = positiveId(makeIdValue);

  if (selectedId) {
    const [row] = await db.select({ id: makes.id }).from(makes).where(eq(makes.id, selectedId)).limit(1);
    if (row) return row.id;
  }

  if (!name) return null;

  const slug = slugify(name);
  const [existingBySlug] = await db.select({ id: makes.id }).from(makes).where(eq(makes.slug, slug)).limit(1);
  if (existingBySlug) return existingBySlug.id;

  const [existingByName] = await db.select({ id: makes.id }).from(makes).where(ilike(makes.name, name)).limit(1);
  if (existingByName) return existingByName.id;

  const [created] = await db
    .insert(makes)
    .values({ name, slug, isActive: true })
    .onConflictDoNothing({ target: makes.slug })
    .returning({ id: makes.id });

  if (created) return created.id;

  const [createdByOtherRequest] = await db.select({ id: makes.id }).from(makes).where(eq(makes.slug, slug)).limit(1);
  return createdByOtherRequest?.id ?? null;
}

async function resolveModelId(
  modelIdValue: string | null | undefined,
  modelNameValue: string,
  makeId: number
) {
  if (!db) return null;

  const name = modelNameValue.trim();
  const selectedId = positiveId(modelIdValue);

  if (selectedId) {
    const [row] = await db
      .select({ id: models.id })
      .from(models)
      .where(and(eq(models.id, selectedId), eq(models.makeId, makeId)))
      .limit(1);
    if (row) return row.id;
  }

  if (!name) return null;

  const slug = slugify(name);
  const [existing] = await db
    .select({ id: models.id })
    .from(models)
    .where(and(eq(models.makeId, makeId), ilike(models.name, name)))
    .limit(1);
  if (existing) return existing.id;

  const [existingBySlug] = await db
    .select({ id: models.id })
    .from(models)
    .where(and(eq(models.makeId, makeId), eq(models.slug, slug)))
    .limit(1);
  if (existingBySlug) return existingBySlug.id;

  const [created] = await db
    .insert(models)
    .values({ makeId, name, slug, isActive: true })
    .returning({ id: models.id });

  return created?.id ?? null;
}

async function resolveBodyTypeId(bodyTypeIdValue: string | null | undefined, bodyTypeNameValue: string) {
  if (!db) return null;

  const name = bodyTypeNameValue.trim();
  const selectedId = positiveId(bodyTypeIdValue);

  if (selectedId) {
    const [row] = await db.select({ id: bodyTypes.id }).from(bodyTypes).where(eq(bodyTypes.id, selectedId)).limit(1);
    if (row) return row.id;
  }

  if (!name) return null;

  const slug = slugify(name);
  const [existingBySlug] = await db.select({ id: bodyTypes.id }).from(bodyTypes).where(eq(bodyTypes.slug, slug)).limit(1);
  if (existingBySlug) return existingBySlug.id;

  const [existingByName] = await db
    .select({ id: bodyTypes.id })
    .from(bodyTypes)
    .where(ilike(bodyTypes.name, name))
    .limit(1);
  if (existingByName) return existingByName.id;

  const [created] = await db
    .insert(bodyTypes)
    .values({ name, slug })
    .onConflictDoNothing({ target: bodyTypes.slug })
    .returning({ id: bodyTypes.id });

  if (created) return created.id;

  const [createdByOtherRequest] = await db
    .select({ id: bodyTypes.id })
    .from(bodyTypes)
    .where(eq(bodyTypes.slug, slug))
    .limit(1);
  return createdByOtherRequest?.id ?? null;
}

export async function resolveVehicleOptionIds({
  makeId,
  makeName,
  modelId,
  modelName,
  bodyTypeId,
  bodyTypeName,
}: {
  makeId: string | null | undefined;
  makeName: string;
  modelId: string | null | undefined;
  modelName: string;
  bodyTypeId: string | null | undefined;
  bodyTypeName: string;
}) {
  const resolvedMakeId = await resolveMakeId(makeId, makeName);
  if (!resolvedMakeId) return null;

  const resolvedModelId = await resolveModelId(modelId, modelName, resolvedMakeId);
  if (!resolvedModelId) return null;

  const resolvedBodyTypeId = await resolveBodyTypeId(bodyTypeId, bodyTypeName);
  if (!resolvedBodyTypeId) return null;

  return {
    makeId: resolvedMakeId,
    modelId: resolvedModelId,
    bodyTypeId: resolvedBodyTypeId,
  };
}
