import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";

interface Event {
  id: string;
  user_id: string;
  url: string;
  start_time: number;
  end_time?: number | null;
}

const queryClient = new QueryClient();

const useEvents = () => {
  return useQuery({
    queryKey: ["events"],
    queryFn: async (): Promise<Event[]> => {
      return await (await fetch("/api/events")).json();
    },
  });
};

const useEvent = (id: string) => {
  return useQuery({
    queryKey: ["events", id],
    queryFn: async (): Promise<Event> => {
      return await (await fetch(`/api/events/${id}`)).json();
    },
  });
};

const Home = () => {
  const { data: events } = useEvents();
  return (
    <ul>
      {events?.map((e) => (
        <li>{JSON.stringify(e)}</li>
      ))}
    </ul>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Home />
    </QueryClientProvider>
  );
};

const elem = document.getElementById("root")!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

if (import.meta.hot) {
  // With hot module reloading, `import.meta.hot.data` is persisted.
  const root = (import.meta.hot.data.root ??= createRoot(elem));
  root.render(app);
} else {
  // The hot module reloading API is not available in production.
  createRoot(elem).render(app);
}
