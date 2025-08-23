import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { useEvents } from "../hooks";
import { useAppState } from "./app";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "./ui/chart";

export const BigLineChart = () => {
  const [appState] = useAppState();
  const { data: events } = useEvents();
  const aggregationType = appState.aggregationType;

  const numBuckets = 10;

  const chartData = [];
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - appState.lookback);
  const bucketWidth = (endDate.getTime() - startDate.getTime()) / numBuckets;

  for (let i = 0; i < numBuckets; i++) {
    chartData[i] = {
      startDate: new Date(startDate.getTime() + bucketWidth * i),
      endDate: new Date(startDate.getTime() + bucketWidth * (i + 1)),
      count: 0,
      visitors: new Set(),
    };
  }

  // TODO -- improve algorithm to avoid nested for-loop
  for (const event of events ?? []) {
    for (const bucket of chartData) {
      if (event.start_time < bucket.endDate.getTime()) {
        if (aggregationType === "visitors") {
          if (!bucket.visitors.has(event.user_id)) {
            bucket.visitors.add(event.user_id);
            bucket.count += 1;
          }
        } else {
          bucket.count += 1;
        }
        break;
      }
    }
  }

  const chartConfig = {
    count: {
      label: aggregationType === "visitors" ? "Visitors" : "Visits",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig}>
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="startDate"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value: Date) =>
            value.toLocaleString(undefined, {
              year: "2-digit",
              month: "2-digit",
              day: "2-digit",
            })
          }
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <defs>
          <linearGradient id="fillCount" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-count)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-count)"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
        <Area
          dataKey="count"
          type="linear"
          fill="url(#fillCount)"
          fillOpacity={0.4}
          stroke="var(--color-count)"
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  );
};
