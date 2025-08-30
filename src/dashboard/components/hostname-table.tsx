import { useAggregatedEvents, useChartData } from "../hooks";
import { HorizontalBarChart } from "./horizontal-bar-chart";

export const HostnameTable = () => {
  const data = useAggregatedEvents();
  const chartData = useChartData(data.hostname);

  return (
    <div className="w-1/2 p-2" style={{ boxSizing: "border-box" }}>
      <HorizontalBarChart
        data={chartData}
        title="Hostname"
        xAxisKey="count"
        yAxisKey="key"
      />
    </div>
  );
};
