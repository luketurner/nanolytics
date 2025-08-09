import { expect, test, describe } from "bun:test";
import { parseUserAgent } from "./user-agent";

describe("parseUserAgent", () => {
  test.each([
    [
      "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36",
      "android",
      "chrome",
      "mobile",
    ],
    [
      "Mozilla/5.0 (iPhone17,5; CPU iPhone OS 18_3_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 FireKeepers/1.7.0",
      "ios",
      "safari",
      "mobile",
    ],
    [
      "Mozilla/5.0 (Windows Phone 10.0; Android 6.0.1; Microsoft; RM-1152) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Mobile Safari/537.36 Edge/15.15254",
      "windows-phone",
      "edge",
      "mobile",
    ],
    [
      "Mozilla/5.0 (iPad16,3; CPU OS 18_3_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Tropicana_NJ/5.7.1",
      "ios",
      "safari",
      "mobile",
    ],
    [
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 Edg/134.0.0.0",
      "windows",
      "edge",
      "desktop",
    ],
    [
      "Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
      "linux",
      "chrome",
      "desktop",
    ],
    [
      "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:15.0) Gecko/20100101 Firefox/15.0.1",
      "linux",
      "firefox",
      "desktop",
    ],
    [
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3.1 Safari/605.1.15",
      "osx",
      "safari",
      "desktop",
    ],
    ["AppleTV14,1/16.1", "other", "other", "other"],
  ])("'%s' -> %s, %s, %s", (ua, os, browser, deviceType) => {
    const result = parseUserAgent(ua);
    expect(result.raw).toEqual(ua);
    expect(result.os).toEqual(os as any);
    expect(result.browser).toEqual(browser as any);
    expect(result.deviceType).toEqual(deviceType as any);
  });
});
