import "@/server-only";
import { Database } from "bun:sqlite";
import { DB_FILE } from "@/config";
import { createEventTable } from "./evemts/model";

export const db = new Database(DB_FILE, { strict: true, create: true });

db.run("PRAGMA journal_mode = WAL");
db.run("PRAGMA foreign_keys = ON");

createEventTable();
