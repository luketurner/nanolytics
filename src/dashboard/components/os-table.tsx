import { useAggregatedEvents, useChartData } from "../hooks";
import { HorizontalBarChart } from "./horizontal-bar-chart";

export const OSTable = () => {
  const data = useAggregatedEvents();
  const chartData = useChartData(data.operating_system);

  return (
    <div className="w-1/2 p-2" style={{ boxSizing: "border-box" }}>
      <HorizontalBarChart
        data={chartData}
        title="OS"
        xAxisKey="count"
        yAxisKey="key"
      />
    </div>
  );
};
