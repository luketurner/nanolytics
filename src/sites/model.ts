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
  const result = db
    .query(
      `SELECT sites.id, hostnames FROM ${tableName}, json_each(${tableName}.hostnames) WHERE json_each.value = :hostname`
    )
    .get({ hostname });
  if (!result) return null;
  return siteSchema.parse(result);
}

export function createSitesTable() {
  db.run(`CREATE TABLE IF NOT EXISTS sites (
    id TEXT PRIMARY KEY,
    hostnames JSONB
  ) WITHOUT ROWID`);

  // TODO -- testing
  db.run(
    `INSERT INTO sites VALUES ('edb73139-24fe-41f1-9089-52b9fbf71bbf', '["localhost:3000", "localhost:8000"]') ON CONFLICT DO NOTHING`
  );
}
