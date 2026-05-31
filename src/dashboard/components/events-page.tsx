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
import { Fragment, useCallback, useState } from "react";
import { shortDuration } from "@/util/date";
import { Badge } from "./ui/badge";
import { ArrowLeft, ArrowRight, MinusSquare, PlusSquare } from "lucide-react";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "./ui/empty";

export const EventsPage: React.FC = () => {
  const { data: events } = useEvents();

  const sortedEvents = events?.toSorted((a, b) => b.start_time - a.start_time);
  return (
    <Container>
      <Header rightChildren={<LookbackChooser />}>
        <Button asChild variant="ghost">
          <Link to="/">Back</Link>
        </Button>
        <SiteSelect />
      </Header>
      <div className="w-2xl m-auto">
        {sortedEvents && sortedEvents.length > 0 ? (
          <PaginatedEventTable events={sortedEvents} />
        ) : (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No Events</EmptyTitle>
              <EmptyDescription>
                Your site hasn't received any traffic within the selected date
                range.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </div>
    </Container>
  );
};

const PaginatedEventTable: React.FC<{ events: UserEvent[] }> = ({ events }) => {
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
      <EventTable events={paginatedEvents} />
    </>
  );
};

const EventTable: React.FC<{ events: UserEvent[] }> = ({ events }) => {
  return (
    <div>
      {events.map((event, i) => (
        <Fragment key={event.id}>
          <EventRow event={event} />
          {i !== events.length - 1 && <div className="border-b m-3" />}
        </Fragment>
      ))}
    </div>
  );
};

const EventRow: React.FC<{ event: UserEvent }> = ({ event }) => {
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
        <div className="text-right underline">{event.user_id}</div>
        <div>{new Date(event.start_time).toLocaleString()}</div>
        <div className="overflow-x-hidden text-ellipsis">{event.url}</div>
        <div>
          {event.is_noscript ? (
            <Badge variant="destructive">Noscript</Badge>
          ) : duration === null ? (
            <Badge variant="secondary">Unknown</Badge>
          ) : (
            <div>{duration}</div>
          )}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="grid gap-x-3 gap-y-1 m-2 grid-cols-[100px_1fr]">
        <div className="text-right">Hostname:</div>
        <div>{event.hostname}</div>
        <div className="text-right">User Agent:</div>
        <div>
          {event.user_agent}
          <div className="flex flex-row gap-2 mt-2">
            <Badge variant="secondary">{event.device_type}</Badge>
            <Badge variant="secondary">{event.operating_system}</Badge>
            <Badge variant="secondary">{event.browser}</Badge>
          </div>
        </div>
        {event.referrer ? (
          <>
            <div className="text-right">Referrer:</div>
            <div>{event.referrer}</div>
          </>
        ) : null}
      </CollapsibleContent>
    </Collapsible>
  );
};
