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
import { useApi } from "./hooks/useApi";

export const useEvents = () => {
  const [appState] = useAppState();
  const api = useApi();
  return useQuery({
    queryKey: ["events", appState.siteId, appState.lookback],
    queryFn: async (): Promise<UserEvent[]> => {
      return await api(
        `/api/events?siteId=${appState.siteId}&lookback=${appState.lookback}`,
      );
    },
  });
};

export const useEvent = (id: string) => {
  const api = useApi();
  return useQuery({
    queryKey: ["events", id],
    queryFn: async (): Promise<UserEvent> => {
      return await api(`/api/events/${id}`);
    },
  });
};

export const useSites = () => {
  const api = useApi();
  return useQuery({
    queryKey: ["sites"],
    queryFn: async (): Promise<Site[]> => {
      return await api(`/api/sites`);
    },
  });
};

export const useUpdateSite = () => {
  const queryClient = useQueryClient();
  const api = useApi();
  return useCallback(
    async (id: string, data: Partial<Site>) => {
      await api(`/api/sites/${id}`, {
        body: JSON.stringify(data),
        method: "POST",
      });
      queryClient.invalidateQueries({ queryKey: ["sites"] });
    },
    [queryClient, api],
  );
};

export const useCreateSite = () => {
  const queryClient = useQueryClient();
  const api = useApi();
  return useCallback(
    async (data: Partial<Omit<Site, "id">>): Promise<Site> => {
      const newSite = await api(`/api/sites`, {
        body: JSON.stringify(data),
        method: "POST",
      });
      queryClient.invalidateQueries({ queryKey: ["sites"] });
      return newSite;
    },
    [queryClient, api],
  );
};

export const useDeleteSite = () => {
  const queryClient = useQueryClient();
  const api = useApi();
  return useCallback(
    async (id: string) => {
      await api(`/api/sites/${id}`, {
        method: "DELETE",
      });
      queryClient.invalidateQueries({ queryKey: ["sites"] });
    },
    [queryClient, api],
  );
};

export interface AggregatedEvents {
  url: Record<AggregationKeyValue<string>, AggregationData>;
  referrer: Record<AggregationKeyValue<string>, AggregationData>;
  hostname: Record<AggregationKeyValue<string>, AggregationData>;
  device_type: Partial<
    Record<AggregationKeyValue<DeviceType>, AggregationData>
  >;
  operating_system: Partial<
    Record<AggregationKeyValue<OperatingSystem>, AggregationData>
  >;
  browser: Partial<Record<AggregationKeyValue<BrowserType>, AggregationData>>;
}

type AggregationKeyValue<T> = T | typeof Total | typeof None;
type AggregationKey = keyof AggregatedEvents;
interface AggregationData {
  count: number;
  avgViewTime: number;
}

export const Total = Symbol();
export const None = Symbol();

function eventViewTime(event: UserEvent): number | null {
  if (!event.end_time) return null;
  return event.end_time - event.start_time;
}

function initialAggregatedEvents(): AggregatedEvents {
  return {
    url: {
      [Total]: { count: 0, avgViewTime: 0 },
      [None]: { count: 0, avgViewTime: 0 },
    },
    referrer: {
      [Total]: { count: 0, avgViewTime: 0 },
      [None]: { count: 0, avgViewTime: 0 },
    },
    hostname: {
      [Total]: { count: 0, avgViewTime: 0 },
      [None]: { count: 0, avgViewTime: 0 },
    },
    device_type: {
      [Total]: { count: 0, avgViewTime: 0 },
      [None]: { count: 0, avgViewTime: 0 },
    },
    operating_system: {
      [Total]: { count: 0, avgViewTime: 0 },
      [None]: { count: 0, avgViewTime: 0 },
    },
    browser: {
      [Total]: { count: 0, avgViewTime: 0 },
      [None]: { count: 0, avgViewTime: 0 },
    },
  };
}

function aggrevateEventsByVisit(events: UserEvent[] | undefined) {
  const agg = initialAggregatedEvents();
  for (const event of events ?? []) {
    const viewTime = eventViewTime(event);
    for (const key of Object.keys(agg) as AggregationKey[]) {
      if (event[key]) {
        inc(agg[key], event[key], "count", 1);
        if (typeof viewTime === "number") {
          inc(agg[key], event[key], "avgViewTime", viewTime);
        }
      } else {
        agg[key][None]!.count += 1;
        if (typeof viewTime === "number") {
          agg[key][None]!.avgViewTime += viewTime;
        }
      }
      agg[key][Total]!.count += 1;
      if (typeof viewTime === "number") {
        agg[key][Total]!.avgViewTime += viewTime;
      }
    }
  }

  for (const key of Object.keys(agg) as AggregationKey[]) {
    const buckets = agg[key];
    for (const bucket of Object.values(buckets)) {
      bucket.avgViewTime /= bucket.count;
    }
    buckets[Total]!.avgViewTime /= buckets[Total]!.count;
    if (buckets[None]!.count) {
      buckets[None]!.avgViewTime /= buckets[None]!.count;
    }
  }
  return agg;
}

function aggrevateEventsByVisitor(events: UserEvent[] | undefined) {
  const agg = initialAggregatedEvents();
  const sets: Record<
    AggregationKey,
    Record<AggregationKeyValue<string>, Set<UserEventId>>
  > = {
    url: { [Total]: new Set(), [None]: new Set() },
    referrer: { [Total]: new Set(), [None]: new Set() },
    hostname: { [Total]: new Set(), [None]: new Set() },
    device_type: { [Total]: new Set(), [None]: new Set() },
    operating_system: { [Total]: new Set(), [None]: new Set() },
    browser: { [Total]: new Set(), [None]: new Set() },
  };

  for (const event of events ?? []) {
    const viewTime = eventViewTime(event);
    for (const key of Object.keys(agg) as AggregationKey[]) {
      const value = event[key];
      const totalSet = sets[key][Total];
      if (value) {
        if (typeof viewTime === "number") {
          inc(agg[key], value, "avgViewTime", viewTime);
        }
        const set = sets[key][value];
        if (set) {
          if (!set.has(event.user_id)) {
            set.add(event.user_id);
            inc(agg[key], value, "count", 1);
          }
        } else {
          sets[key][value] = new Set([event.user_id]);
          inc(agg[key], value, "count", 1);
        }
      } else {
        if (typeof viewTime === "number") {
          agg[key][None]!.avgViewTime += viewTime;
        }
        const noneSet = sets[key][None];
        if (!noneSet.has(event.user_id)) {
          noneSet.add(event.user_id);
          agg[key][None]!.count += 1;
        }
      }
      if (typeof viewTime === "number") {
        agg[key][Total]!.avgViewTime += viewTime;
      }
      if (!totalSet.has(event.user_id)) {
        totalSet.add(event.user_id);
        agg[key][Total]!.count += 1;
      }
    }
  }

  const aggByVisit = aggrevateEventsByVisit(events);

  for (const key of Object.keys(agg) as AggregationKey[]) {
    const buckets = agg[key];
    for (const [bucketKey, bucket] of Object.entries(buckets)) {
      bucket.avgViewTime /= aggByVisit[key][bucketKey as any].count;
    }
    buckets[Total]!.avgViewTime /= aggByVisit[key][Total]!.count;
    if (buckets[None]!.count) {
      buckets[None]!.avgViewTime /= aggByVisit[key][None]!.count;
    }
  }
  return agg;
}

// TODO -- also calculate view time
export const useAggregatedEvents = (): AggregatedEvents => {
  const [appState] = useAppState();
  const { data: events } = useEvents();
  const aggregationType = appState.aggregationType;

  const aggregatedEvents = useMemo(() => {
    const agg: AggregatedEvents = initialAggregatedEvents();

    if (aggregationType === "visits") {
      return aggrevateEventsByVisit(events);
    } else {
      return aggrevateEventsByVisitor(events);
    }

    return agg;
  }, [aggregationType, events]);

  return aggregatedEvents;
};

export function useChartData(
  data: Record<AggregationKeyValue<string>, AggregationData>,
) {
  return useMemo(() => {
    const chartData = Object.entries(data ?? {}).map(
      ([key, { count, avgViewTime }]) => ({
        key,
        count,
        avgViewTime: `${(avgViewTime / 1000).toFixed(1)}s`,
      }),
    );

    if (data[None].count) {
      chartData.push({
        key: "None",
        count: data[None].count,
        avgViewTime: `${(data[None].avgViewTime / 1000).toFixed(1)}s`,
      });
    }

    chartData.sort((a, b) => b.count - a.count);

    chartData.unshift({
      key: "Total",
      count: data[Total].count,
      avgViewTime: `${(data[Total].avgViewTime / 1000).toFixed(1)}s`,
    });

    return chartData;
  }, [data]);
}

function inc(
  obj: { [key: string]: AggregationData | undefined },
  key: string | null | undefined,
  innerKey: keyof AggregationData,
  num: number,
) {
  if (!key) return;
  if (!obj[key]) obj[key] = { count: 0, avgViewTime: 0 };
  obj[key][innerKey] += num;
}
