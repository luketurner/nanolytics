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
import { useState } from "react";
import { shortDuration } from "@/util/date";

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
      <div className="w-xl m-auto">
        {sortedEvents?.map((event) => (
          <EventRow event={event} />
        ))}
      </div>
    </Container>
  );
};

const EventRow: React.FC<{ event: UserEvent }> = ({ event }) => {
  const [open, setOpen] = useState(false);
  const duration = shortDuration(event.start_time, event.end_time);
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="grid gap-2 grid-cols-[8px_40px_192px_1fr_80px] cursor-pointer w-full text-left">
        <div>{open ? "-" : "+"}</div>
        <div className="text-right">{event.user_id}</div>
        <div>{new Date(event.start_time).toLocaleString()}</div>
        <div className="overflow-x-hidden text-ellipsis">{event.url}</div>
        <div>
          {event.is_noscript ? (
            <div>Noscript</div>
          ) : duration === null ? (
            <div>N/A</div>
          ) : (
            <div>{duration}</div>
          )}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="grid gap-x-3 gap-y-1 m-1 mt-0 grid-cols-[100px_1fr]">
        <div className="text-right">Hostname:</div>
        <div>{event.hostname}</div>
        <div className="text-right">User Agent:</div>
        <div>
          {event.user_agent}
          <div className="flex flex-row gap-2">
            <div>{event.device_type}</div>
            <div>{event.operating_system}</div>
            <div>{event.browser}</div>
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
