import { useAggregatedEvents, useChartData } from "../hooks";
import { HorizontalBarChart } from "./horizontal-bar-chart";

export const DeviceTypeTable = () => {
  const data = useAggregatedEvents();
  const chartData = useChartData(data.device_type);

  return (
    <div className="w-1/2 p-2" style={{ boxSizing: "border-box" }}>
      <HorizontalBarChart
        data={chartData}
        title="Device type"
        xAxisKey="count"
        yAxisKey="key"
      />
    </div>
  );
};
