import { useQuery } from "@tanstack/react-query";
import { useAppState } from "./components/app";

export interface Event {
  id: string;
  user_id: string;
  url: string;
  start_time: number;
  end_time?: number | null;
}

export const useEvents = () => {
  const [appState] = useAppState();
  return useQuery({
    queryKey: ["events", appState.lookback],
    queryFn: async (): Promise<Event[]> => {
      return await (
        await fetch(`/api/events?looback=${appState.lookback}`)
      ).json();
    },
  });
};

export const useEvent = (id: string) => {
  return useQuery({
    queryKey: ["events", id],
    queryFn: async (): Promise<Event> => {
      return await (await fetch(`/api/events/${id}`)).json();
    },
  });
};
