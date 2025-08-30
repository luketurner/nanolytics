import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppState, type AggregationType } from "./components/app";
import type { Site } from "@/sites/schema";
import { useCallback, useMemo } from "react";
import type {
  BrowserType,
  DeviceType,
  OperatingSystem,
} from "@/util/user-agent";
import type { UserEvent, UserEventId } from "@/evemts/schema";

export const useEvents = () => {
  const [appState] = useAppState();
  return useQuery({
    queryKey: ["events", appState.siteId, appState.lookback],
    queryFn: async (): Promise<UserEvent[]> => {
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
    queryFn: async (): Promise<UserEvent> => {
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

export interface AggregatedEvents {
  url: Record<string, number>;
  referrer: Record<string, number>;
  hostname: Record<string, number>;
  device_type: Partial<Record<DeviceType, number>>;
  operating_system: Partial<Record<OperatingSystem, number>>;
  browser: Partial<Record<BrowserType, number>>;
}

type AggregationKey = keyof AggregatedEvents;

// TODO -- also calculate view time
export const useAggregatedEvents = (): AggregatedEvents => {
  const [appState] = useAppState();
  const { data: events } = useEvents();
  const aggregationType = appState.aggregationType;

  const aggregatedEvents = useMemo(() => {
    const agg: AggregatedEvents = {
      url: {},
      referrer: {},
      hostname: {},
      device_type: {},
      operating_system: {},
      browser: {},
    };

    if (aggregationType === "visits") {
      for (const event of events ?? []) {
        for (const key of Object.keys(agg) as AggregationKey[]) {
          inc(agg[key], event[key], 1);
        }
      }
    } else {
      const sets: Record<AggregationKey, Record<string, Set<UserEventId>>> = {
        url: {},
        referrer: {},
        hostname: {},
        device_type: {},
        operating_system: {},
        browser: {},
      };

      for (const event of events ?? []) {
        for (const key of Object.keys(agg) as AggregationKey[]) {
          const value = event[key];
          if (!value) continue;
          const set = sets[key][value];
          if (set) {
            if (!set.has(event.user_id)) {
              set.add(event.user_id);
              inc(agg[key], value, 1);
            }
          } else {
            sets[key][value] = new Set([event.user_id]);
            inc(agg[key], value, 1);
          }
        }
      }
    }

    return agg;
  }, [aggregationType, events]);

  return aggregatedEvents;
};

export function useChartData(data: Record<string, number>) {
  return useMemo(() => {
    const chartData = Object.entries(data ?? {})
      .map(([key, count]) => ({
        key,
        count,
      }))
      .toSorted((a, b) => b.count - a.count);

    const totalData = chartData.reduce<{
      count: number;
    }>(
      (data, datum) => {
        data.count += datum.count;
        return data;
      },
      {
        count: 0,
      }
    );

    chartData.unshift({
      key: "Total",
      count: totalData.count,
    });
    return chartData;
  }, [data]);
}

function inc(
  obj: { [key: string]: number | undefined },
  key: string | null | undefined,
  num: number
) {
  if (!key) return;
  if (!obj[key]) obj[key] = 0;
  obj[key] += num;
}
