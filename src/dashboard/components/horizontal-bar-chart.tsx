import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/dashboard/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/dashboard/components/ui/chart";

const chartConfig = {
  main: {
    label: "Main",
    color: "var(--chart-2)",
  },
  label: {
    color: "var(--background)",
  },
} satisfies ChartConfig;

export function HorizontalBarChart<DataType extends object>({
  data,
  title,
  yAxisKey,
  xAxisKey,
  labelKey,
}: {
  data: DataType[];
  title: string;
  yAxisKey: keyof DataType & (string | number);
  xAxisKey: keyof DataType & (string | number);
  labelKey?: keyof DataType & (string | number);
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {/* <CardDescription>January - June 2024</CardDescription> */}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={data}
            layout="vertical"
            margin={{
              right: 16,
            }}
            barSize={32}
            barGap={4}
            height={100}
          >
            {/* <CartesianGrid horizontal={false} /> */}
            <YAxis
              dataKey={yAxisKey}
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              // tickFormatter={(value) => value.slice(0, 3)}
              hide
            />
            <XAxis dataKey={xAxisKey} type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey={xAxisKey}
              layout="vertical"
              fill="var(--color-main)"
              radius={4}
            >
              <LabelList
                dataKey={labelKey ?? yAxisKey}
                position="insideLeft"
                offset={8}
                className="fill-(--color-label)"
                fontSize={12}
              />
              <LabelList
                dataKey={xAxisKey}
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter> */}
    </Card>
  );
}
