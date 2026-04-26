import { useCallback } from "react";
import { useAppState } from "../components/app";
import { useNavigate } from "@tanstack/react-router";

export type FetchApiOptions = RequestInit & {
  headers?: { [key: string]: string } | undefined;
};

export function useApi() {
  const navigate = useNavigate();
  const [appState, setAppState] = useAppState();
  const token = appState?.session?.token;
  return useCallback(
    async (url: string, options?: FetchApiOptions) => {
      const resp = await fetch(url, {
        ...options,
        headers: {
          ...options?.headers,
          ...(token ? { authorization: `Bearer ${token}` } : null),
        },
      });

      if (resp.status === 401) {
        setAppState((draft) => {
          draft.session = null;
        });
      }
      if (resp.status === 403) {
        const data = await resp.text();
        if (data === "Expired password") {
          await navigate({ to: "/user/expired" });
        }
      }
      if (!resp.ok) {
        throw new Error(await resp.text());
      }
      return await resp.json();
    },
    [token, setAppState],
  );
}
