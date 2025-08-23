import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppState } from "./components/app";
import type { Site } from "@/sites/schema";
import { useCallback } from "react";

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
    queryKey: ["events", appState.siteId, appState.lookback],
    queryFn: async (): Promise<Event[]> => {
      return await (
        await fetch(
          `/api/events?siteId=${appState.siteId}&lookback=${appState.lookback}`
        )
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

export const useSites = () => {
  return useQuery({
    queryKey: ["sites"],
    queryFn: async (): Promise<Site[]> => {
      return await (await fetch(`/api/sites`)).json();
    },
  });
};

export const useUpdateSite = () => {
  const queryClient = useQueryClient();
  return useCallback(
    async (id: string, data: Partial<Site>) => {
      await fetch(`/api/sites/${id}`, {
        body: JSON.stringify(data),
        method: "POST",
      });
      queryClient.invalidateQueries({ queryKey: ["sites"] });
    },
    [queryClient]
  );
};

export const useCreateSite = () => {
  const queryClient = useQueryClient();
  return useCallback(
    async (data: Partial<Omit<Site, "id">>): Promise<Site> => {
      const newSite = await fetch(`/api/sites`, {
        body: JSON.stringify(data),
        method: "POST",
      });
      queryClient.invalidateQueries({ queryKey: ["sites"] });
      return await newSite.json();
    },
    [queryClient]
  );
};

export const useDeleteSite = () => {
  const queryClient = useQueryClient();
  return useCallback(
    async (id: string) => {
      await fetch(`/api/sites/${id}`, {
        method: "DELETE",
      });
      queryClient.invalidateQueries({ queryKey: ["sites"] });
    },
    [queryClient]
  );
};
