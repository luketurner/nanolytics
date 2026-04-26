import { CogIcon, MenuIcon } from "lucide-react";
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
import { SiteMetrics } from "./site-metrics";
import { Container } from "./container";
import { Header } from "./header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useCallback } from "react";
import { Link } from "@tanstack/react-router";

export const Home = () => {
  const { data: sites } = useSites();
  const [appState, setAppState] = useAppState();

  if (
    sites &&
    sites.length > 0 &&
    (!appState.siteId || !sites.some((s) => s.id === appState.siteId))
  ) {
    setAppState((draft) => {
      draft.siteId = sites[0]?.id;
    });
  }

  if (!sites?.length && appState.siteId) {
    setAppState((draft) => {
      draft.siteId = undefined;
    });
  }

  return (
    <Container>
      <Header rightChildren={<LookbackChooser />}>
        <Select
          disabled={!sites?.length}
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
      </Header>
      {appState.siteId ? (
        <SiteMetrics />
      ) : (
        <div className="prose lg:prose-xl m-auto mt-8">
          <p>
            Welcome to nanolytics. You don't have any sites configured yet. To
            get started:
          </p>
          <ol>
            <li>
              <div className="flex flex-row items-center">
                Click the
                <CogIcon className="inline mx-2" />
                in the top right.
              </div>
            </li>
            <li>
              Click <strong>Create new site</strong>.
            </li>
            <li>
              Add one or more <strong>Hostnames</strong> to your site. Metrics
              will only be associated with your site if they match the site's
              hostname(s).
            </li>
          </ol>
        </div>
      )}
    </Container>
  );
};
