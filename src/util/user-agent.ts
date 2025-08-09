export const browserTypes = [
  "edge",
  "chrome",
  "firefox",
  "safari",
  "other",
] as const;

export const operatingSystems = [
  "windows",
  "linux",
  "android",
  "ios",
  "osx",
  "windows-phone",
  "other",
] as const;

export const deviceTypes = ["mobile", "desktop", "other"] as const;

export type BrowserType = (typeof browserTypes)[number];
export type OperatingSystem = (typeof operatingSystems)[number];
export type DeviceType = (typeof deviceTypes)[number];

export interface ParsedUserAgent {
  raw: string;
  browser: BrowserType;
  os: OperatingSystem;
  deviceType: DeviceType;
}

export function parseUserAgent(ua: string) {
  const result: ParsedUserAgent = {
    raw: ua,
    os: "other",
    browser: "other",
    deviceType: "other",
  };

  if (ua.includes("Windows")) {
    result.os = "windows";
    result.deviceType = "desktop";
  }

  if (ua.includes("Linux") || ua.includes("CrOS") || ua.includes("X11")) {
    result.os = "linux";
    result.deviceType = "desktop";
  }

  if (ua.includes("Android")) {
    result.os = "android";
    result.deviceType = "mobile";
  }

  if (ua.includes("Mac OS X") || ua.includes("Macintosh")) {
    result.os = "osx";
    result.deviceType = "desktop";
  }

  if (ua.includes("iPhone") || ua.includes("iPad")) {
    result.os = "ios";
    result.browser = "safari";
    result.deviceType = "mobile";
  }

  if (ua.includes("Windows Phone")) {
    result.os = "windows-phone";
    result.deviceType = "mobile";
  }

  if (ua.includes("Safari")) {
    result.browser = "safari";
  }

  if (ua.includes("Chrome")) {
    result.browser = "chrome";
  }

  if (ua.includes("Edg/") || ua.includes("Edge/")) {
    result.browser = "edge";
  }

  if (ua.includes("Firefox")) {
    result.browser = "firefox";
  }

  return result;
}
