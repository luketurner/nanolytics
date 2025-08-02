import { useEvents } from "../hooks";
import { useAppState } from "./app";
import { HorizontalBarChart } from "./horizontal-bar-chart";

export const PageTable = () => {
  const [appState] = useAppState();
  const { data: events } = useEvents();
  const aggregationType = appState.aggregationType;

  const pages = events?.reduce<
    Record<
      string,
      {
        ids: Set<string>;
        totalViewTime: number | null;
      }
    >
  >((pages, event) => {
    const id = aggregationType === "visitors" ? event.user_id : event.id;
    const viewTime = event.end_time ? event.end_time - event.start_time : null;
    const existing = pages[event.url];
    if (existing === undefined) {
      pages[event.url] = {
        ids: new Set([id]),
        totalViewTime: viewTime,
      };
    } else {
      existing.ids?.add(id);
      if (viewTime) {
        if (existing.totalViewTime === null) {
          existing.totalViewTime = viewTime;
        } else {
          existing.totalViewTime += viewTime;
        }
      }
    }
    return pages;
  }, {});

  const pagesForChart = Object.entries(pages ?? {}).map(([page, data]) => ({
    page,
    count: data.ids.size,
    totalViewTime: data.totalViewTime,
    label: `${page} (avg. ${
      data.totalViewTime === null
        ? "N/A"
        : Math.round(data.totalViewTime / data.ids.size / 1000)
    }s)`,
  }));

  const totalData = pagesForChart.reduce<{
    totalViewTime: number | null;
    count: number;
  }>(
    (data, page) => {
      if (page.totalViewTime) {
        if (data.totalViewTime === null) {
          data.totalViewTime = page.totalViewTime;
        } else {
          data.totalViewTime += page.totalViewTime;
        }
      }
      data.count += page.count;
      return data;
    },
    {
      totalViewTime: null,
      count: 0,
    }
  );

  pagesForChart.unshift({
    page: "Total",
    count: totalData.count,
    totalViewTime: totalData.totalViewTime,
    label: `Total (avg. ${
      totalData.totalViewTime === null
        ? "N/A"
        : Math.round(totalData.totalViewTime / totalData.count / 1000)
    }s)`,
  });

  return (
    <div className="w-xl">
      <HorizontalBarChart
        data={pagesForChart}
        title="Pages"
        xAxisKey="count"
        yAxisKey="page"
        labelKey="label"
      />
    </div>
  );
};
