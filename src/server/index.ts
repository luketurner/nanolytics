import "@/server-only";
import { z } from "zod/v4";
import { randomUUID } from "crypto";
import dashboardIndex from "@/dashboard/index.html";
import { getUserId } from "@/util/user-id";
import { DASHBOARD_PORT, PORT } from "@/config";
import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
} from "@/evemts/model";
import noscript from "@/tracker/noscript.gif" with { type: "file" };
import tracker from "dist/tracker.js" with { type: "file" };
import { parseUserAgent } from "@/util/user-agent";
import { getSiteForHostname } from "@/sites/model";

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
    port: DASHBOARD_PORT,
    routes: {
      "/": dashboardIndex,
      "/api/events": {
        GET: (req: Bun.BunRequest<"/api/events">) => {
          const queryParams = new URLSearchParams(new URL(req.url).search);
          return Response.json(
            getAllEvents(parseInt(queryParams.get("lookback") ?? "7", 10))
          );
        },
      },
      "/api/event/:id": {
        GET: (req) => {
          return Response.json(getEventById(req.params.id));
        },
      },
    },
  });

  Bun.serve({
    port: PORT,
    routes: {
      "/tracker.js": {
        GET: () => {
          const resp = new Response(Bun.file(tracker as string));
          resp.headers.set("access-control-allow-origin", "*");
          return resp;
        },
      },
      "/noscript.gif": {
        GET: (req: Bun.BunRequest<"/noscript.gif">, server) => {
          const address = server.requestIP(req);
          if (address) {
            const parsedUserAgent = parseUserAgent(
              req.headers.get("user-agent") ?? ""
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
          const parsedUserAgent = parseUserAgent(
            req.headers.get("user-agent") ?? ""
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
      "/finish": {
        POST: async (req) => {
          const body = finishApiSchema.parse(await req.json());
          updateEvent(body.id, { end_time: body.end_time });
          return Response.json({ status: "ok" });
        },
      },
    },
  });
  console.log(`Listening on port ${PORT}`);
  console.log(`Dashboard listening on port ${DASHBOARD_PORT}`);
}
