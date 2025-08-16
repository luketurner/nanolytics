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
      `SELECT sites.id, hostnames, name FROM ${tableName}, json_each(${tableName}.hostnames) WHERE json_each.value = :hostname`
    )
    .get({ hostname });
  if (!result) return null;
  return siteSchema.parse(result);
}

export function createSitesTable() {
  db.run(`CREATE TABLE IF NOT EXISTS sites (
    id TEXT PRIMARY KEY,
    name TEXT,
    hostnames JSONB
  ) WITHOUT ROWID`);

  // TODO -- testing
  db.run(
    `INSERT INTO sites VALUES ('edb73139-24fe-41f1-9089-52b9fbf71bbf', 'localhost', '["localhost:8000"]') ON CONFLICT DO NOTHING`
  );

  // TODO -- testing
  db.run(
    `INSERT INTO sites VALUES ('716df551-d9de-4f51-b08a-ae91c19dd905', 'example.com', '["example.com"]') ON CONFLICT DO NOTHING`
  );
}
