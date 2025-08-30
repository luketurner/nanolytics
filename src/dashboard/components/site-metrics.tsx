import { useEvents } from "../hooks";
import { useAppState, type AggregationType } from "./app";
import { BigLineChart } from "./big-line-chart";
import { BrowserTable } from "./browser-table";
import { DeviceTypeTable } from "./device-type-table";
import { HostnameTable } from "./hostname-table";
import { OSTable } from "./os-table";
import { PageTable } from "./page-table";
import { ReferrerTable } from "./referrer-table";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

export const SiteMetrics = () => {
  const [appState, setAppState] = useAppState();
  const { data: events } = useEvents();

  const numVisitors = events?.reduce((visitors, event) => {
    visitors.add(event.user_id);
    return visitors;
  }, new Set()).size;
  const numVisits = events?.length;
  const changeAggregationType = (newType: AggregationType) => {
    setAppState((draft) => {
      draft.aggregationType = newType;
    });
  };

  return (
    <>
      <div className="flex flex-row gap-2 my-2 mx-2 h-10">
        <Button
          variant={
            appState.aggregationType === "visitors" ? "default" : "ghost"
          }
          size="lg"
          onClick={() => changeAggregationType("visitors")}
          className="rounded-none"
        >
          {numVisitors} Visitors
        </Button>
        <Separator orientation="vertical" />
        <Button
          variant={appState.aggregationType === "visits" ? "default" : "ghost"}
          onClick={() => changeAggregationType("visits")}
          size="lg"
          className="rounded-none"
        >
          {numVisits} Visits
        </Button>
      </div>
      <Separator className="my-2" />
      <BigLineChart />
      <div className="flex flex-row flex-wrap">
        <PageTable />
        <ReferrerTable />
        <HostnameTable />
        <DeviceTypeTable />
        <BrowserTable />
        <OSTable />
      </div>
    </>
  );
};
