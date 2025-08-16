import { fromJSONString } from "@/util/sql";
import z from "zod/v4";

export const siteSchema = z.object({
  id: z.uuid(),
  name: z.string().max(32),
  hostnames: z.preprocess(fromJSONString, z.array(z.string())),
});

export const siteSchemaClient = siteSchema.extend({
  hostnames: z.array(z.string()),
});

export type Site = z.infer<typeof siteSchema>;
export type SiteId = Site["id"];
