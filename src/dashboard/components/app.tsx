import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Home } from "./home";
import { createContext, useContext, useEffect } from "react";
import { useImmer, type ImmerHook } from "use-immer";
import type { SiteId } from "@/sites/schema";
import { AuthWrapper } from "./auth-wrapper";
import type { MaybeSession } from "../hooks/useSession";

export const queryClient = new QueryClient();

export type AggregationType = "visitors" | "visits";

export interface AppState {
  lookback: number;
  aggregationType: AggregationType;
  siteId: SiteId | undefined;
  session: MaybeSession;
}

const defaultState: AppState = {
  lookback: 7,
  aggregationType: "visitors",
  siteId: undefined,
  session: null,
};

const AppStateContext = createContext<ImmerHook<AppState>>([
  defaultState,
  () => {},
]);

export const useAppState = () => {
  return useContext(AppStateContext);
};

const appStateKey = "nanolytics:app_state";

export const App = () => {
  const existingState = window.localStorage.getItem(appStateKey);
  const [state, setState] = useImmer<AppState>(
    existingState ? JSON.parse(existingState) : defaultState,
  );

  useEffect(() => {
    if (state) {
      window.localStorage.setItem(appStateKey, JSON.stringify(state));
    }
  }, [state]);
  return (
    <QueryClientProvider client={queryClient}>
      <AppStateContext.Provider value={[state, setState]}>
        <AuthWrapper>
          <Home />
        </AuthWrapper>
      </AppStateContext.Provider>
    </QueryClientProvider>
  );
};
