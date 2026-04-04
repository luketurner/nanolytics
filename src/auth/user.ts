import "@/server-only";

import { db } from "@/db";
import z from "zod/v4";
import { createKeysForObject, createValuesForObject } from "@/util/sql";
import { ADMIN_PASSWORD, ADMIN_USER } from "@/config";

export const tableName = "users";

export const userSchema = z.object({
  id: z.uuid(),
  username: z.string().min(1).max(32),
  password_hash: z.string().min(1),
});

export type User = z.infer<typeof userSchema>;
export type UserId = User["id"];

const ADMIN_USER_ID = "0575b8d3-78c5-4f0b-ae68-c5c9741a4139";

export function getUser(id: string): User | null {
  return userSchema
    .nullable()
    .parse(db.query(`SELECT * FROM ${tableName} WHERE id = :id`).get({ id }));
}

export function getUserByUsernameAndPassword(
  username: string,
  password: string,
): User | null {
  return userSchema
    .nullable()
    .parse(
      db
        .query(
          `SELECT * FROM ${tableName} WHERE username = :username AND password_hash = :password`,
        )
        .get({ username, password }),
    );
}

function createUser(data: User): User {
  const validData = userSchema.parse(data);
  return userSchema.parse(
    db
      .query(
        `INSERT INTO ${tableName} (${createKeysForObject(
          validData,
        )}) VALUES (${createValuesForObject(validData)}) RETURNING *`,
      )
      .get(validData),
  );
}

export function createAdminUser(): User {
  const existingUser = getUser(ADMIN_USER_ID);
  if (existingUser) {
    return existingUser;
  }
  return createUser({
    id: ADMIN_USER_ID,
    username: ADMIN_USER,
    password_hash: ADMIN_PASSWORD,
  });
}

export function createUsersTable() {
  db.run(`CREATE TABLE IF NOT EXISTS ${tableName} (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE,
    password_hash TEXT
  ) WITHOUT ROWID`);
}
