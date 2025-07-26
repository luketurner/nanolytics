import { z } from "zod/v4";

export const eventSchema = z.object({
  id: z.uuid(),
  user_id: z.string(),
  url: z.string(),
  start_time: z.number(),
  end_time: z.number().optional().nullish(),
});

export type UserEvent = z.infer<typeof eventSchema>;
export type UserEventId = UserEvent["id"];
