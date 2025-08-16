import { fromJSONString } from "@/util/sql";
import z from "zod/v4";

export const siteSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1).max(32),
  hostnames: z.preprocess(fromJSONString, z.array(z.string().min(1))),
});

export const siteSchemaClient = siteSchema.extend({
  hostnames: z.array(z.string().min(1)),
});

export type Site = z.infer<typeof siteSchema>;
export type SiteId = Site["id"];
