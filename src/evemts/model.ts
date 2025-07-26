import "@/server-only";
import {
  eventSchema,
  type UserEvent,
  type UserEventId,
  type UserEventInput,
} from "./schema";
import { db } from "@/db";
import {
  createKeysForObject,
  createValuesForObject,
  updateForObject,
} from "@/util/sql";

export const tableName = "events";

export function getAllEvents(): UserEvent[] {
  return db
    .query(`SELECT * FROM ${tableName}`)
    .all()
    .map((v) => eventSchema.parse(v));
}

export function getEventById(id: UserEventId): UserEvent {
  return eventSchema.parse(
    db.query(`SELECT * FROM ${tableName} WHERE id = :id`).get({ id })
  );
}

export function createEvent(data: UserEventInput): UserEvent {
  const validData = eventSchema.parse(data);
  return eventSchema.parse(
    db
      .query(
        `INSERT INTO ${tableName} (${createKeysForObject(
          validData
        )}) VALUES (${createValuesForObject(validData)}) RETURNING *`
      )
      .get(validData)
  );
}

export function updateEvent(
  id: UserEventId,
  data: Partial<UserEventInput>
): UserEvent {
  const validData = eventSchema.partial().parse(data);
  return eventSchema.parse(
    db
      .query(
        `UPDATE ${tableName} SET ${updateForObject(
          validData
        )} WHERE id = :id RETURNING *`
      )
      .get({ ...validData, id })
  );
}

export function createEventTable() {
  db.run(`CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    url TEXT,
    start_time DATETIME,
    end_time DATETIME,
    is_noscript BOOLEAN
  ) WITHOUT ROWID`);
}
