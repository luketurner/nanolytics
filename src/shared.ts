import { randomUUID } from "crypto";

export function getVisitId() {
  return randomUUID();
}
