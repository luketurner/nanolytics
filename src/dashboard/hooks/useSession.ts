import { useCallback } from "react";
import { useAppState } from "../components/app";

export interface Session {
  token: string;
}

export type MaybeSession = Session | null;

export const useSession = () => {
  const [appState, setAppState] = useAppState();

  const login = useCallback(
    async (username: string, password: string) => {
      try {
        const response = await fetch(`/auth/login`, {
          method: "POST",
          body: JSON.stringify({
            username,
            password,
          }),
        });
        const token: string | undefined = (await response.json())?.token;
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
    [setAppState],
  );

  return {
    session: appState.session,
    login,
  };
};
