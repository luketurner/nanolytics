import "@/server-only";

import { db } from "@/db";
import { siteSchema, type Site } from "./schema";

export const tableName = "sites";

export function getAllSites(): Site[] {
  return db
    .query(`SELECT * FROM ${tableName}`)
    .all()
    .map((v) => siteSchema.parse(v));
}

export function getSiteForHostname(hostname: string | null): Site | null {
  if (!hostname) return null;
  return siteSchema.parse(
    db
      .query(
        `SELECT * FROM ${tableName}, jsonb_each(${tableName}.hostnames) WHERE jsonb_each.value = :hostname`
      )
      .get({ hostname })
  );
}

export function createSitesTable() {
  db.run(`CREATE TABLE IF NOT EXISTS sites (
    id TEXT PRIMARY KEY,
    hostnames JSONB
  ) WITHOUT ROWID`);
}
