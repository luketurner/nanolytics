import { Link } from "@tanstack/react-router";
import { Container } from "./container";
import { Header } from "./header";
import { Button } from "./ui/button";
import { useEvents } from "../hooks";
import type { UserEvent } from "@/evemts/schema";
import { SiteSelect } from "./site-select";
import { LookbackChooser } from "./lookback-chooser";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { Fragment, useCallback, useMemo, useState } from "react";
import { shortDuration } from "@/util/date";
import { Badge } from "./ui/badge";
import {
  ArrowLeft,
  ArrowRight,
  MinusSquare,
  PlusSquare,
  X,
} from "lucide-react";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "./ui/empty";
import { FilterSelect } from "./filter-select";
import {
  browserLabel,
  deviceTypeLabel,
  operatingSystemLabel,
  type BrowserType,
  type DeviceType,
  type OperatingSystem,
} from "@/util/user-agent";

export const EventsPage: React.FC = () => {
  const { data: events, isLoading } = useEvents();

  const sortedEvents = useMemo(() => {
    return events?.toSorted((a, b) => b.start_time - a.start_time);
  }, [events]);

  const [userId, setUserId] = useState("");
  const [browser, setBrowser] = useState("");
  const [device, setDevice] = useState("");
  const [os, setOs] = useState("");
  const [hostname, setHostname] = useState("");
  const [referrer, setReferrer] = useState("");
  const [url, setUrl] = useState("");
  const [hasJs, setHasJs] = useState("");

  const userIds = new Set<string>();
  const browsers = new Set<BrowserType>();
  const devices = new Set<DeviceType>();
  const oses = new Set<OperatingSystem>();
  const hostnames = new Set<string>();
  const referrers = new Set<string>();
  const urls = new Set<string>();

  for (const event of events ?? []) {
    userIds.add(event.user_id);
    browsers.add(event.browser);
    devices.add(event.device_type);
    oses.add(event.operating_system);
    if (event.hostname) hostnames.add(event.hostname);
    if (event.referrer) referrers.add(event.referrer);
    urls.add(event.url);
  }

  const filteredEvents = sortedEvents?.filter((event) => {
    if (userId && event.user_id !== userId) return false;
    if (browser && event.browser !== browser) return false;
    if (device && event.device_type !== device) return false;
    if (os && event.operating_system !== os) return false;
    if (hostname && event.hostname !== hostname) return false;
    if (referrer && event.referrer !== referrer) return false;
    if (url && event.url !== url) return false;
    if (hasJs === "yes" && event.is_noscript) return false;
    if (hasJs === "no" && !event.is_noscript) return false;
    return true;
  });

  return (
    <Container>
      <Header rightChildren={<LookbackChooser />}>
        <Button asChild variant="ghost">
          <Link to="/">Back</Link>
        </Button>
        <SiteSelect />
      </Header>
      <div className="w-2xl m-auto">
        {events && events.length > 0 ? (
          <>
            <div className="flex flex-row flex-wrap gap-4">
              <FilterSelect
                placeholder="User ID"
                value={userId}
                onChange={setUserId}
                items={Array.from(userIds).map((v) => ({ label: v, value: v }))}
              />
              <FilterSelect
                placeholder="Browser"
                value={browser}
                onChange={setBrowser}
                items={Array.from(browsers).map((v) => ({
                  label: browserLabel(v),
                  value: v,
                }))}
              />
              <FilterSelect
                placeholder="Device"
                value={device}
                onChange={setDevice}
                items={Array.from(devices).map((v) => ({
                  label: deviceTypeLabel(v),
                  value: v,
                }))}
              />
              <FilterSelect
                placeholder="OS"
                value={os}
                onChange={setOs}
                items={Array.from(oses).map((v) => ({
                  label: operatingSystemLabel(v),
                  value: v,
                }))}
              />
              <FilterSelect
                placeholder="Hostname"
                value={hostname}
                onChange={setHostname}
                items={Array.from(hostnames).map((v) => ({
                  label: v,
                  value: v,
                }))}
              />
              <FilterSelect
                placeholder="Referrer"
                value={referrer}
                onChange={setReferrer}
                items={Array.from(referrers).map((v) => ({
                  label: v,
                  value: v,
                }))}
              />
              <FilterSelect
                placeholder="URL"
                value={url}
                onChange={setUrl}
                items={Array.from(urls).map((v) => ({
                  label: v,
                  value: v,
                }))}
              />
              <FilterSelect
                placeholder="Noscript"
                value={hasJs}
                onChange={setHasJs}
                items={[
                  { value: "yes", label: "Javascript" },
                  { value: "no", label: "No Javascript" },
                ]}
              />
            </div>
            {filteredEvents && filteredEvents.length > 0 ? (
              <PaginatedEventTable
                events={filteredEvents}
                onUrlClick={setUrl}
                onUserClick={setUserId}
                onNoscriptClick={setHasJs}
                onBrowserClick={setBrowser}
                onDeviceTypeClick={setDevice}
                onOperatingSystemClick={setOs}
                onHostnameClick={setHostname}
                onReferrerClick={setReferrer}
              />
            ) : (
              <Empty>
                <EmptyHeader>
                  <EmptyTitle>No Matching Events</EmptyTitle>
                  <EmptyDescription>
                    There are no events matching your selected filters.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </>
        ) : isLoading ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>Loading...</EmptyTitle>
              <EmptyDescription>
                Event data is being loaded. Please wait.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No Events</EmptyTitle>
              <EmptyDescription>
                Your site hasn't received any traffic in the selected date
                range.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </div>
    </Container>
  );
};

const PaginatedEventTable: React.FC<{
  events: UserEvent[];
  onUserClick: (v: string) => void;
  onUrlClick: (v: string) => void;
  onNoscriptClick: (v: string) => void;
  onBrowserClick: (v: string) => void;
  onOperatingSystemClick: (v: string) => void;
  onDeviceTypeClick: (v: string) => void;
  onHostnameClick: (v: string) => void;
  onReferrerClick: (v: string) => void;
}> = ({ events, ...handlers }) => {
  const [page, setPage] = useState(0);
  const handleNextPage = useCallback(() => {
    setPage((page) => page + 1);
  }, [setPage]);
  const handlePrevPage = useCallback(() => {
    setPage((page) => page - 1);
  }, [setPage]);

  const pageSize = 25;
  const paginatedEvents = events.slice(page * pageSize, (page + 1) * pageSize);
  const hasNextPage = (page + 1) * pageSize < events.length;
  const hasPrevPage = page > 0;
  return (
    <>
      <div className="mb-2 flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePrevPage}
          disabled={!hasPrevPage}
        >
          <ArrowLeft />
        </Button>
        <div className="flex-1 text-center">
          viewing {page * pageSize + 1} to{" "}
          {Math.min((page + 1) * pageSize, events.length)} of {events.length}{" "}
          events
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleNextPage}
          disabled={!hasNextPage}
        >
          <ArrowRight />
        </Button>
      </div>
      <EventTable events={paginatedEvents} {...handlers} />
    </>
  );
};

const EventTable: React.FC<{
  events: UserEvent[];
  onUserClick: (v: string) => void;
  onUrlClick: (v: string) => void;
  onNoscriptClick: (v: string) => void;
  onBrowserClick: (v: string) => void;
  onOperatingSystemClick: (v: string) => void;
  onDeviceTypeClick: (v: string) => void;
  onHostnameClick: (v: string) => void;
  onReferrerClick: (v: string) => void;
}> = ({ events, ...handlers }) => {
  return (
    <div>
      {events.map((event, i) => (
        <Fragment key={event.id}>
          <EventRow event={event} {...handlers} />
          {i !== events.length - 1 && <div className="border-b m-3" />}
        </Fragment>
      ))}
    </div>
  );
};

const EventRow: React.FC<{
  event: UserEvent;
  onUserClick: (v: string) => void;
  onUrlClick: (v: string) => void;
  onNoscriptClick: (v: string) => void;
  onBrowserClick: (v: string) => void;
  onOperatingSystemClick: (v: string) => void;
  onDeviceTypeClick: (v: string) => void;
  onHostnameClick: (v: string) => void;
  onReferrerClick: (v: string) => void;
}> = ({
  event,
  onUserClick,
  onUrlClick,
  onNoscriptClick,
  onBrowserClick,
  onOperatingSystemClick,
  onDeviceTypeClick,
  onHostnameClick,
  onReferrerClick,
}) => {
  const [open, setOpen] = useState(false);
  const duration = shortDuration(event.start_time, event.end_time);
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="grid gap-4 grid-cols-[8px_40px_192px_1fr_80px] cursor-pointer w-full text-left items-center">
        <div>
          {open ? (
            <MinusSquare strokeWidth={1} className="text-gray-500" />
          ) : (
            <PlusSquare strokeWidth={1} className="text-gray-500" />
          )}
        </div>
        <div className="text-right" onClick={() => onUserClick(event.user_id)}>
          {event.user_id}
        </div>
        <div>{new Date(event.start_time).toLocaleString()}</div>
        <div
          className="overflow-x-hidden text-ellipsis"
          onClick={() => onUrlClick(event.url)}
        >
          {event.url}
        </div>
        <div>
          {event.is_noscript ? (
            <Badge variant="destructive" onClick={() => onNoscriptClick("no")}>
              Noscript
            </Badge>
          ) : duration === null ? (
            <Badge variant="secondary">Unknown</Badge>
          ) : (
            <div>{duration}</div>
          )}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="grid gap-x-3 gap-y-1 m-2 grid-cols-[100px_1fr]">
        {event.hostname ? (
          <>
            <div className="text-right">Hostname:</div>
            <div
              className="cursor-pointer underline"
              onClick={() => onHostnameClick(event.hostname!)}
            >
              {event.hostname}
            </div>
          </>
        ) : null}
        {event.referrer ? (
          <>
            <div className="text-right">Referrer:</div>
            <div
              className="cursor-pointer underline"
              onClick={() => onReferrerClick(event.referrer!)}
            >
              {event.referrer}
            </div>
          </>
        ) : null}
        <div className="text-right">User Agent:</div>
        <div>
          {event.user_agent}
          <div className="flex flex-row gap-2 mt-2">
            <Badge
              variant="secondary"
              className="cursor-pointer"
              onClick={() => onDeviceTypeClick(event.device_type)}
            >
              {deviceTypeLabel(event.device_type)}
            </Badge>
            <Badge
              variant="secondary"
              className="cursor-pointer"
              onClick={() => onOperatingSystemClick(event.operating_system)}
            >
              {operatingSystemLabel(event.operating_system)}
            </Badge>
            <Badge
              variant="secondary"
              className="cursor-pointer"
              onClick={() => onBrowserClick(event.browser)}
            >
              {browserLabel(event.browser)}
            </Badge>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
