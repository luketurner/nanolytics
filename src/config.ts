import "@/server-only";

export const DB_FILE = process.env.DB_FILE || "local/db.sqlite";
export const PORT = process.env.PORT || 3000;
export const DASHBOARD_PORT = process.env.DASHBOARD_PORT || 3001;

// NOTE: If updating DEFAULT_TRACKER_KEY, replace in tracker.ts script as well.
export const DEFAULT_TRACKER_KEY = "Zk6oRyceUNh";
export const TRACKER_KEY = process.env.TRACKER_KEY || DEFAULT_TRACKER_KEY;

export const ADMIN_USER = process.env.ADMIN_USER || "admin";
export const ADMIN_PASSWORD =
  process.env.ADMIN_PASSWORD || "SJRYENjOy7lSVml8U1hlzg";

if (!TRACKER_KEY.match(/^[0-9a-zA-Z]+$/)) {
  throw new Error("Invalid TRACKER_KEY, must be alphanumeric.");
}
