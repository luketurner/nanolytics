import "@/server-only";

import { db } from "@/db";
import z from "zod/v4";
import { randomBytes, randomUUID } from "crypto";
import {
  createKeysForObject,
  createValuesForObject,
  updateForObject,
} from "@/util/sql";

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

function getExpiration() {
  return Date.now() + THIRTY_MINUTES_IN_MS;
}

export function checkSession(token: string | undefined): Session | null {
  if (!token) {
    return null;
  }

  const session = sessionSchema
    .nullish()
    .parse(
      db
        .query(`SELECT * FROM ${tableName} WHERE token = :token`)
        .get({ token }),
    );

  if (!session) {
    return null;
  }

  if (session.expires < Date.now()) {
    deleteSession(session.id);
    return null;
  }

  const updatedSession = updateSession(session.id, {
    expires: getExpiration(),
  });

  return updatedSession;
}

export function createSession(userId: string): Session {
  const data = {
    id: randomUUID(),
    user_id: userId,
    token: randomBytes(32).toString("hex"),
    expires: getExpiration(),
  };
  const validData = sessionSchema.parse(data);

  // Clean up any old sessions -- this just needs to run every now and then
  deleteExpiredSessions();

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

export function updateSession(
  id: SessionId,
  data: Partial<Session>,
): Session | null {
  const validData = sessionSchema.partial().parse(data);
  const result = db
    .query(
      `UPDATE ${tableName} SET ${updateForObject(
        validData,
      )} WHERE id = :id RETURNING *`,
    )
    .get({
      ...validData,
      id,
    });
  return result ? sessionSchema.parse(result) : null;
}

export function deleteSession(id: SessionId) {
  db.query(`DELETE FROM ${tableName} WHERE id = :id`).get({
    id,
  });
}

export function deleteExpiredSessions() {
  db.query(
    `DELETE FROM ${tableName} WHERE expires < (unixepoch() * 1000)`,
  ).run();
}

export function createSessionsTable() {
  db.run(`CREATE TABLE IF NOT EXISTS ${tableName} (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    token TEXT UNIQUE,
    expires DATETIME
  ) WITHOUT ROWID`);
}
