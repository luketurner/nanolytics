import { z } from "zod/v4";
import { Database } from "bun:sqlite";
import { getVisitId } from "./shared";
import { sha } from "bun";
import indexHtml from "./index.html";

const DB_FILE = process.env.DB_FILE || "local/db.sqlite";
const PORT = process.env.PORT || 3000;
const DASHBOARD_PORT = process.env.DASHBOARD_PORT || 3001;

const db = new Database(DB_FILE, { strict: true, create: true });

db.run("PRAGMA journal_mode = WAL");
db.run("PRAGMA foreign_keys = ON");

db.run(`CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  url TEXT,
  start_time DATETIME,
  end_time DATETIME
) WITHOUT ROWID`);

const recordApiSchema = z.object({
  id: z.uuid(),
  start_time: z.number(),
  end_time: z.number().nullable(),
});

const finishApiSchema = z.object({
  id: z.uuid(),
  end_time: z.number(),
});

export function getUserId(ip: string) {
  return Buffer.from(sha(ip) as any).toBase64();
}

Bun.serve({
  port: DASHBOARD_PORT,
  routes: {
    "/": indexHtml,
  },
});

Bun.serve({
  port: PORT,
  routes: {
    "/client.js": {
      GET: () => {
        const resp = new Response(Bun.file("./dist/client.js"));
        resp.headers.set("access-control-allow-origin", "*");
        return resp;
      },
    },
    "/noscript.gif": {
      GET: (req: Bun.BunRequest<"/noscript.gif">, server) => {
        const address = server.requestIP(req);
        if (address) {
          db.query(
            "INSERT INTO events (id, user_id, url, start_time) VALUES (:id, :user_id, :url, :start_time)"
          ).run({
            id: getVisitId(),
            user_id: getUserId(address.address),
            url: null, // TODO -- get request URL for noscript.gif? Can we get this in Referer somehow?
            start_time: Date.now(),
          });
        }

        const resp = new Response(Bun.file("./dist/noscript.gif"));
        resp.headers.set(
          "cache-control",
          "no-cache, no-store, must-revalidate"
        );
        resp.headers.set("expires", "0");
        resp.headers.set("pragma", "no-cache");
        resp.headers.set("access-control-allow-origin", "*");

        return resp;
      },
    },
    "/record": {
      POST: async (req, server) => {
        const body = recordApiSchema.parse(await req.json());
        const address = server.requestIP(req);
        if (!address) {
          return Response.error();
        }
        db.query(
          "INSERT INTO events (id, user_id, url, start_time, end_time) VALUES (:id, :user_id, :url, :start_time, :end_time)"
        ).run({
          ...body,
          user_id: getUserId(address.address),
        });

        return Response.json({ status: "ok" });
      },
    },
    "/finish": {
      POST: async (req) => {
        const body = finishApiSchema.parse(await req.json());
        db.query("UPDATE events SET end_time = :end_time WHERE id = :id").run(
          body
        );

        return Response.json({ status: "ok" });
      },
    },
  },
});
console.log(`Listening on port ${PORT}`);
console.log(`Dashboard listening on port ${DASHBOARD_PORT}`);
