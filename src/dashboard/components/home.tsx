import { useCallback } from "react";
import { useEvents } from "../hooks";
import { useAppState, type AggregationType } from "./app";
import { LookbackChooser } from "./lookback-chooser";
import { Button } from "./ui/button";

export const Home = () => {
  const [appState, setAppState] = useAppState();
  const { data: events } = useEvents();
  const numVisitors = events?.reduce((visitors, event) => {
    visitors.add(event.user_id);
    return visitors;
  }, new Set()).size;
  const numVisits = events?.length;
  const changeAggregationType = useCallback(
    (newType: AggregationType) => {
      setAppState({ ...appState, aggregationType: newType });
    },
    [setAppState]
  );
  return (
    <>
      <LookbackChooser />
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
      <ul>
        {events?.map((e) => (
          <li>{JSON.stringify(e)}</li>
        ))}
      </ul>
    </>
  );
};
