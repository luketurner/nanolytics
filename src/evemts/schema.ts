import { booleanFromNumber } from "@/util/sql";
import { browserTypes, deviceTypes, operatingSystems } from "@/util/user-agent";
import { z } from "zod/v4";

export const eventSchema = z.object({
  id: z.uuid(),
  user_id: z.string(),
  url: z.string(),
  start_time: z.number(),
  end_time: z.number().optional().nullish(),
  hostname: z.string().nullable(),
  device_type: z.enum(deviceTypes),
  browser: z.enum(browserTypes),
  operating_system: z.enum(operatingSystems),
  user_agent: z.string(),
  referrer: z.string().optional().nullish(),
  is_noscript: z.preprocess(booleanFromNumber, z.boolean()).default(false),
});

export type UserEvent = z.infer<typeof eventSchema>;
export type UserEventInput = z.input<typeof eventSchema>;
export type UserEventId = UserEvent["id"];
