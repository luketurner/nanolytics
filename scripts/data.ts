import { clearEvents, createEvent } from "@/evemts/model";
import { getAllSites } from "@/sites/model";
import {
  type BrowserType,
  type DeviceType,
  type OperatingSystem,
} from "@/util/user-agent";
import { randomUUID } from "node:crypto";

const site = getAllSites()[0]!;

const NUM_USERS = 100;
const NUM_EVENTS = 1000;
const LOOKBACK = 30 * 24 * 60 * 60 * 1000;

clearEvents();

console.log("Generating events...");
for (let i = 0; i < NUM_EVENTS; i++) {
  const startTime = Date.now() - Math.trunc(Math.random() * LOOKBACK);
  const endTime = Math.trunc(Math.random() * 100000) + startTime;
  createEvent({
    id: randomUUID(),
    site_id: site.id,
    user_id: (NUM_USERS * Math.random()).toFixed(0),
    url: randomUrl(),
    start_time: startTime,
    end_time: i < 750 ? endTime : null,
    hostname: "localhost:3000",
    device_type: randomDeviceType(),
    browser: randomBrowser(),
    operating_system: randomOS(),
    user_agent: "Foo/123 NotMozilla/2.0",
    referrer: i < 250 ? "http://google.com" : null,
    is_noscript: i > 50,
  });
}

function randomUrl(): string {
  const seed = Math.random();
  return `/${Math.trunc(seed * 100)}`;
}

function randomDeviceType(): DeviceType {
  const seed = Math.random();
  if (seed > 0.95) return "other";
  if (seed > 0.75) return "mobile";
  return "desktop";
}

function randomBrowser(): BrowserType {
  const seed = Math.random();
  if (seed > 0.9) return "other";
  if (seed > 0.8) return "edge";
  if (seed > 0.6) return "firefox";
  if (seed > 0.2) return "chrome";
  return "safari";
}

function randomOS(): OperatingSystem {
  const seed = Math.random();
  if (seed > 0.95) return "other";
  if (seed > 0.8) return "windows";
  if (seed > 0.7) return "linux";
  if (seed > 0.5) return "osx";
  if (seed > 0.4) return "ios";
  if (seed > 0.05) return "android";
  return "windows-phone";
}
