import { useCallback } from "react";
import { useAppState, type AppState } from "../components/app";
import { useSession } from "./useSession";

export type FetchApiOptions = RequestInit & {
  headers?: { [key: string]: string } | undefined;
};

export function useApi() {
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

      if (resp.status === 403) {
        setAppState((draft) => {
          draft.session = null;
        });
      }
      return await resp.json();
    },
    [token, setAppState],
  );
}
