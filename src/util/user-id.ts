import { sha } from "bun";

export function getUserId(ip: string) {
  return Buffer.from(sha(ip) as any).toBase64();
}
