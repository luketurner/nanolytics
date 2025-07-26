import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Home } from "./home";
import { createContext, useContext, useState } from "react";

export const queryClient = new QueryClient();

export interface AppState {
  lookback: number;
}

const defaultState = {
  lookback: 7,
};

const AppStateContext = createContext<
  [AppState, React.Dispatch<React.SetStateAction<AppState>>]
>([defaultState, () => {}]);

export const useAppState = () => {
  return useContext(AppStateContext);
};

export const App = () => {
  const state = useState(defaultState);
  return (
    <QueryClientProvider client={queryClient}>
      <AppStateContext.Provider value={state}>
        <Home />
      </AppStateContext.Provider>
    </QueryClientProvider>
  );
};
