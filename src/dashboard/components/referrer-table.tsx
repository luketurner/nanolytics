import { useAggregatedEvents, useChartData } from "../hooks";
import { HorizontalBarChart } from "./horizontal-bar-chart";

export const ReferrerTable = () => {
  const data = useAggregatedEvents();
  const chartData = useChartData(data.referrer);

  return (
    <div className="w-1/2 p-2" style={{ boxSizing: "border-box" }}>
      <HorizontalBarChart
        data={chartData}
        title="Referrer"
        xAxisKey="count"
        yAxisKey="key"
      />
    </div>
  );
};
