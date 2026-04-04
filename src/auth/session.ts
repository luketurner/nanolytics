import "@/server-only";

import { db } from "@/db";
import z from "zod/v4";
import { randomBytes, randomUUID } from "crypto";
import { createKeysForObject, createValuesForObject } from "@/util/sql";

const THIRTY_MINUTES_IN_MS = 30 * 60 * 1000;

export const tableName = "sessions";

export const sessionSchema = z.object({
  id: z.uuid(),
  user_id: z.uuid(),
  token: z.string().min(1),
  expires: z.number(),
});

export type Session = z.infer<typeof sessionSchema>;
export type SessionId = Session["id"];

export function getSessionByToken(token: string): Session {
  return sessionSchema.parse(
    db.query(`SELECT * FROM ${tableName} WHERE token = :token`).get({ token }),
  );
}

export function createSession(userId: string): Session {
  const data = {
    id: randomUUID(),
    user_id: userId,
    token: randomBytes(32).toString("hex"),
    expires: Date.now() + THIRTY_MINUTES_IN_MS,
  };
  const validData = sessionSchema.parse(data);
  return sessionSchema.parse(
    db
      .query(
        `INSERT INTO ${tableName} (${createKeysForObject(
          validData,
        )}) VALUES (${createValuesForObject(validData)}) RETURNING *`,
      )
      .get(validData),
  );
}

export function createSessionsTable() {
  db.run(`CREATE TABLE IF NOT EXISTS ${tableName} (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    token TEXT UNIQUE,
    expires DATETIME
  ) WITHOUT ROWID`);
}
