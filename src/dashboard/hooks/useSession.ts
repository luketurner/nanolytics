import { useCallback } from "react";
import { useAppState } from "../components/app";
import { useApi } from "./useApi";

export interface Session {
  token: string;
}

export type MaybeSession = Session | null;

export const useSession = () => {
  const [appState, setAppState] = useAppState();
  const api = useApi();
  const login = useCallback(
    async (username: string, password: string) => {
      try {
        const response = await api(`/auth/login`, {
          method: "POST",
          body: JSON.stringify({
            username,
            password,
          }),
        });
        const token: string | undefined = response?.token;
        if (!token) throw new Error("Could not log in.");
        setAppState((draft) => {
          draft.session = {
            token,
          };
        });
      } catch (e) {
        throw new Error("Could not log in.");
      }
    },
    [setAppState, api],
  );

  return {
    session: appState.session,
    login,
  };
};
