import { useEvents } from "../hooks";
import { useAppState, type AggregationType } from "./app";
import { PageTable } from "./page-table";
import { Button } from "./ui/button";

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
      <div>
        <Button
          variant={
            appState.aggregationType === "visitors" ? "default" : "secondary"
          }
          onClick={() => changeAggregationType("visitors")}
        >
          Visitors: {numVisitors}
        </Button>
        <Button
          variant={
            appState.aggregationType === "visits" ? "default" : "secondary"
          }
          onClick={() => changeAggregationType("visits")}
        >
          Visits: {numVisits}
        </Button>
      </div>
      <PageTable />
    </>
  );
};
