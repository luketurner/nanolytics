import { useAggregatedEvents, useChartData } from "../hooks";
import { HorizontalBarChart } from "./horizontal-bar-chart";

export const BrowserTable = () => {
  const data = useAggregatedEvents();
  const chartData = useChartData(data.browser);

  return (
    <div className="w-1/2 p-2" style={{ boxSizing: "border-box" }}>
      <HorizontalBarChart
        data={chartData}
        title="Browser"
        xAxisKey="count"
        yAxisKey="key"
      />
    </div>
  );
};
