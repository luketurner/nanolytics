import { useQuery } from "@tanstack/react-query";

export interface Event {
  id: string;
  user_id: string;
  url: string;
  start_time: number;
  end_time?: number | null;
}

export const useEvents = () => {
  return useQuery({
    queryKey: ["events"],
    queryFn: async (): Promise<Event[]> => {
      return await (await fetch("/api/events")).json();
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
