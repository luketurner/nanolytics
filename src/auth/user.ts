import "@/server-only";

import { db } from "@/db";
import z from "zod/v4";
import {
  createKeysForObject,
  createValuesForObject,
  updateForObject,
} from "@/util/sql";
import { ADMIN_PASSWORD, ADMIN_USER } from "@/config";

export const tableName = "users";

export const userSchema = z.object({
  id: z.uuid(),
  username: z.string().min(1).max(32),
  password_hash: z.string().min(1),
});

export const passwordSchema = z.string().min(6);

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
  if (user && (await verifyUserPassword(user, password))) {
    return user;
  }
  return null;
}

export async function verifyUserPassword(user: User, password: string) {
  return verifyPassword(password, user.password_hash);
}

async function createUser(data: UserWithPassword): Promise<User> {
  passwordSchema.parse(data.password);
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

export async function updateUser(
  id: UserId,
  data: Partial<UserWithPassword>,
): Promise<User | null> {
  passwordSchema.parse(data.password);
  const validData = userSchema.partial().parse({
    ...data,
    ...(data.password
      ? { password_hash: await hashPassword(data.password) }
      : null),
  });
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
  return result ? userSchema.parse(result) : null;
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
