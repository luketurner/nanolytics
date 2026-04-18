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

export interface UserWithPassword extends Omit<User, "password_hash"> {
  password: string;
}

const ADMIN_USER_ID = "0575b8d3-78c5-4f0b-ae68-c5c9741a4139";

export function getUser(id: string): User | null {
  return userSchema
    .nullable()
    .parse(db.query(`SELECT * FROM ${tableName} WHERE id = :id`).get({ id }));
}

export async function getUserByUsernameAndPassword(
  username: string,
  password: string,
): Promise<User | null> {
  const user = userSchema
    .nullable()
    .parse(
      db
        .query(`SELECT * FROM ${tableName} WHERE username = :username`)
        .get({ username }),
    );
  if (user && (await verifyPassword(password, user.password_hash))) {
    return user;
  }
  return null;
}

async function createUser(data: UserWithPassword): Promise<User> {
  const validData = userSchema.parse({
    ...data,
    password_hash: await hashPassword(data.password),
  });
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

export async function createAdminUser(): Promise<User> {
  const existingUser = getUser(ADMIN_USER_ID);
  if (existingUser) {
    return existingUser;
  }
  return createUser({
    id: ADMIN_USER_ID,
    username: ADMIN_USER,
    password: ADMIN_PASSWORD,
  });
}

export function createUsersTable() {
  db.run(`CREATE TABLE IF NOT EXISTS ${tableName} (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE,
    password_hash TEXT
  ) WITHOUT ROWID`);
}

function hashPassword(cleartext: string) {
  return Bun.password.hash(cleartext);
}

function verifyPassword(cleartext: string, hash: string) {
  return Bun.password.verify(cleartext, hash);
}
