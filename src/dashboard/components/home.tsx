import { CogIcon } from "lucide-react";
import { useEvents, useSites } from "../hooks";
import { useAppState, type AggregationType } from "./app";
import { LookbackChooser } from "./lookback-chooser";
import { PageTable } from "./page-table";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Settings } from "./settings";

export const Home = () => {
  const [appState, setAppState] = useAppState();
  const { data: events } = useEvents();
  const { data: sites } = useSites();

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

  if (
    sites &&
    sites.length > 0 &&
    (!appState.siteId || !sites.some((s) => s.id === appState.siteId))
  ) {
    setAppState((draft) => {
      draft.siteId = sites[0]?.id;
    });
  }

  return (
    <div className="max-w-5xl m-auto mt-4 mb-4">
      <div className="flex gap-2 content-baseline mb-4">
        <Select
          value={appState.siteId}
          onValueChange={(newId) =>
            setAppState((draft) => {
              draft.siteId = newId;
            })
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Site name" />
          </SelectTrigger>
          <SelectContent>
            {sites?.map((site) => (
              <SelectItem value={site.id}>{site.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="grow"></div>
        <LookbackChooser />
        <Sheet>
          <SheetTrigger>
            <Button variant="ghost" size="icon">
              <CogIcon />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-xl sm:max-w-xl">
            <SheetHeader>
              <SheetTitle>Settings</SheetTitle>
            </SheetHeader>
            <Settings />
          </SheetContent>
        </Sheet>
      </div>
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
    </div>
  );
};
