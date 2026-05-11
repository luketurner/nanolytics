export interface Page {
  url: string;
  name: string;
  hidden: boolean;
}

export const pages = [
  { url: "/", name: "Home", hidden: false },
  { url: "/events", name: "Events", hidden: false },
  { url: "/user", name: "User", hidden: false },
  { url: "/settings", name: "Settings", hidden: false },
  { url: "/login", name: "Login", hidden: true },
  { url: "/user/expired", name: "Password Expired", hidden: true },
] as const;

export type PageUrl = (typeof pages)[number]["url"];
