import "@/server-only";
import { z } from "zod/v4";
import { randomUUID } from "crypto";
import dashboardIndex from "@/dashboard/index.html";
import { getUserId } from "@/util/user-id";
import { DEFAULT_TRACKER_KEY, PORT, TRACKER_KEY } from "@/config";
import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
} from "@/evemts/model";
import noscript from "@/tracker/noscript.gif" with { type: "file" };
import tracker from "dist/tracker.js" with { type: "file" };
import { parseUserAgent } from "@/util/user-agent";
import {
  getAllSites,
  getSiteForHostname,
  updateSite,
  createSite,
  deleteSite,
} from "@/sites/model";
import { getUserByUsernameAndPassword } from "@/auth/user";
import { checkSession, createSession } from "@/auth/session";

const recordApiSchema = z.object({
  id: z.uuid(),
  url: z.string(),
  start_time: z.number(),
  end_time: z.number().nullable(),
  referrer: z.string().nullish(),
});

const finishApiSchema = z.object({
  id: z.uuid(),
  end_time: z.number(),
});

export function startServer() {
  Bun.serve({
    port: PORT,
    routes: {
      "/": dashboardIndex,
      "/login": dashboardIndex,
      "/user": dashboardIndex,
      "/api/events": {
        GET: (req: Bun.BunRequest<"/api/events">) => {
          requireUserSession(req);
          const queryParams = new URLSearchParams(new URL(req.url).search);
          const siteId = queryParams.get("siteId");
          if (!siteId) {
            return Response.json([]);
          }
          const lookback = parseInt(queryParams.get("lookback") ?? "7", 10);
          return Response.json(getAllEvents(siteId, lookback));
        },
      },
      "/api/event/:id": {
        GET: (req) => {
          requireUserSession(req);
          return Response.json(getEventById(req.params.id));
        },
      },
      "/api/sites": {
        GET: (req) => {
          requireUserSession(req);
          return Response.json(getAllSites());
        },
        POST: async (req) => {
          requireUserSession(req);
          return Response.json(createSite(await req.json()));
        },
      },
      "/api/sites/:id": {
        POST: async (req) => {
          requireUserSession(req);
          return Response.json(updateSite(req.params.id, await req.json()));
        },
        DELETE: async (req) => {
          requireUserSession(req);
          return Response.json(deleteSite(req.params.id));
        },
      },
      "/auth/login": {
        POST: async (req: Bun.BunRequest<"/auth/login">) => {
          const body = await req.json();
          const user = await getUserByUsernameAndPassword(
            body?.username,
            body?.password,
          );
          if (!user) {
            throw new Response("Invalid login", { status: 403 });
          }
          const session = createSession(user.id);
          return Response.json({
            token: session.token,
          });
        },
      },

      // Begin public routes

      "/:key/tracker.js": {
        GET: async (req) => {
          if (req.params.key !== TRACKER_KEY)
            return new Response("Not Found", { status: 404 });
          const script = await Bun.file(tracker as string).text();
          const resp = new Response(
            script.replaceAll(DEFAULT_TRACKER_KEY, TRACKER_KEY),
          );
          resp.headers.set("access-control-allow-origin", "*");
          return resp;
        },
      },
      "/:key/noscript.gif": {
        GET: (req, server) => {
          if (req.params.key !== TRACKER_KEY)
            return new Response("Not Found", { status: 404 });
          const address = server.requestIP(req);
          if (address) {
            const parsedUserAgent = parseUserAgent(
              req.headers.get("user-agent") ?? "",
            );

            const referrer = req.headers.get("referer");
            const hostname = referrer ? new URL(referrer).host : null;
            const site = getSiteForHostname(hostname);
            if (site) {
              createEvent({
                id: randomUUID(),
                site_id: site.id,
                user_id: getUserId(address.address),
                url: "/", // TODO -- get request URL for noscript.gif?
                start_time: Date.now(),
                is_noscript: true,
                user_agent: parsedUserAgent.raw,
                browser: parsedUserAgent.browser,
                device_type: parsedUserAgent.deviceType,
                operating_system: parsedUserAgent.os,
                hostname,
              });
            } else {
              console.warn("Hostname doesn't match any site:", hostname);
            }
          }

          const resp = new Response(Bun.file(noscript));
          resp.headers.set(
            "cache-control",
            "no-cache, no-store, must-revalidate",
          );
          resp.headers.set("expires", "0");
          resp.headers.set("pragma", "no-cache");
          resp.headers.set("access-control-allow-origin", "*");

          return resp;
        },
      },
      "/:key/record": {
        POST: async (req, server) => {
          if (req.params.key !== TRACKER_KEY)
            return new Response("Not Found", { status: 404 });
          const body = recordApiSchema.parse(await req.json());
          const address = server.requestIP(req);
          if (!address) {
            return Response.error();
          }
          const parsedUserAgent = parseUserAgent(
            req.headers.get("user-agent") ?? "",
          );

          const origin = req.headers.get("origin");
          const hostname = origin ? new URL(origin).host : null;
          const site = getSiteForHostname(hostname);

          if (site) {
            createEvent({
              ...body,
              site_id: site.id,
              user_id: getUserId(address.address),
              hostname,
              user_agent: parsedUserAgent.raw,
              browser: parsedUserAgent.browser,
              device_type: parsedUserAgent.deviceType,
              operating_system: parsedUserAgent.os,
            });
          } else {
            console.warn("Hostname doesn't match any site:", hostname);
          }

          return Response.json({ status: "ok" });
        },
      },
      "/:key/finish": {
        POST: async (req) => {
          if (req.params.key !== TRACKER_KEY)
            return new Response("Not Found", { status: 404 });
          const body = finishApiSchema.parse(await req.json());
          updateEvent(body.id, { end_time: body.end_time });
          return Response.json({ status: "ok" });
        },
      },
    },
    error(error) {
      if (error instanceof Response) {
        return error;
      }
      return new Response(error?.message ?? "Unknown error", { status: 500 });
    },
  });
  console.log(`Listening on port ${PORT}`);
}

function requireUserSession<T extends string>(req: Bun.BunRequest<T>) {
  if (
    !checkSession(req.headers.get("authorization")?.replace(/^Bearer /, ""))
  ) {
    throw new Response("Invalid session", { status: 403 });
  }
}
