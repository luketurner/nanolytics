import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Home } from "./home";
import { createContext, useContext } from "react";
import { useImmer, type ImmerHook } from "use-immer";
import type { SiteId } from "@/sites/schema";

export const queryClient = new QueryClient();

export type AggregationType = "visitors" | "visits";

export interface AppState {
  lookback: number;
  aggregationType: AggregationType;
  siteId: SiteId | undefined;
}

const defaultState: AppState = {
  lookback: 7,
  aggregationType: "visitors",
  siteId: undefined,
};

const AppStateContext = createContext<ImmerHook<AppState>>([
  defaultState,
  () => {},
]);

export const useAppState = () => {
  return useContext(AppStateContext);
};

export const App = () => {
  const state = useImmer(defaultState);
  return (
    <QueryClientProvider client={queryClient}>
      <AppStateContext.Provider value={state}>
        <Home />
      </AppStateContext.Provider>
    </QueryClientProvider>
  );
};
