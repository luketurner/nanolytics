import "@/server-only";

import { db } from "@/db";
import { siteSchema, type Site, type SiteId } from "./schema";
import {
  createKeysForObject,
  createValuesForObject,
  updateForObject,
} from "@/util/sql";
import { randomUUID } from "crypto";

export const tableName = "sites";

export function getAllSites(): Site[] {
  return db
    .query(`SELECT * FROM ${tableName}`)
    .all()
    .map((v) => siteSchema.parse(v));
}

export function getSiteForHostname(hostname: string | null): Site | null {
  if (!hostname) return null;
  const result = db
    .query(
      `SELECT sites.id, hostnames, name FROM ${tableName}, json_each(${tableName}.hostnames) WHERE json_each.value = :hostname`
    )
    .get({ hostname });
  if (!result) return null;
  return siteSchema.parse(result);
}

export function updateSite(id: SiteId, data: Partial<Site>): Site | null {
  const validData = siteSchema.partial().parse(data);
  const result = db
    .query(
      `UPDATE ${tableName} SET ${updateForObject(
        validData
      )} WHERE id = :id RETURNING *`
    )
    .get({
      ...validData,
      hostnames: JSON.stringify(validData.hostnames),
      id,
    });
  return result ? siteSchema.parse(result) : null;
}

export function createSite(data: Omit<Site, "id">): Site {
  const validData = siteSchema.omit({ id: true }).parse(data);
  return siteSchema.parse(
    db
      .query(
        `INSERT INTO ${tableName} (${createKeysForObject(
          validData
        )}, id) VALUES (${createValuesForObject(validData)}, :id) RETURNING *`
      )
      .get({
        ...validData,
        hostnames: JSON.stringify(validData.hostnames),
        id: randomUUID(),
      })
  );
}

export function deleteSite(id: SiteId) {
  db.query(`DELETE FROM ${tableName} WHERE id = :id`).get({
    id,
  });
}

export function createSitesTable() {
  db.run(`CREATE TABLE IF NOT EXISTS sites (
    id TEXT PRIMARY KEY,
    name TEXT,
    hostnames JSONB
  ) WITHOUT ROWID`);
}
