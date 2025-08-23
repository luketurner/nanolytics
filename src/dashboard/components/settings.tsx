import { useState } from "react";
import { useCreateSite, useDeleteSite, useSites } from "../hooks";
import { useAppState } from "./app";
import { SiteForm } from "./site-form";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { type SiteId } from "@/sites/schema";

export const Settings = () => {
  const { data: sites } = useSites();
  const createSite = useCreateSite();
  const [appState] = useAppState();
  const [selectedSite, setSelectedSite] = useState<SiteId | undefined>(
    appState.siteId
  );

  console.log("selectedSite", selectedSite);

  return (
    <div>
      {sites?.length ? (
        <>
          <div className="flex flex-row gap-2 m-4">
            <Select
              value={selectedSite}
              onValueChange={setSelectedSite}
              disabled={!sites?.length}
            >
              <SelectTrigger className="w-[180px] grow">
                <SelectValue placeholder="No sites available" />
              </SelectTrigger>
              <SelectContent>
                {sites?.map((site) => (
                  <SelectItem value={site.id}>{site.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={async () => {
                const newSite = await createSite({
                  name: "Unnamed site",
                  hostnames: [],
                });
                if (newSite.id) setSelectedSite(newSite.id);
              }}
              variant="secondary"
            >
              New site
            </Button>
          </div>
          {selectedSite ? (
            <SiteForm
              key={selectedSite}
              site={selectedSite}
              onDelete={() =>
                setSelectedSite(
                  sites?.filter((s) => s.id !== selectedSite)?.[0]?.id ??
                    undefined
                )
              }
            />
          ) : null}
        </>
      ) : (
        <div className="m-4 flex flex-row">
          <Button
            onClick={async () => {
              const newSite = await createSite({
                name: "Unnamed site",
                hostnames: [],
              });
              if (newSite.id) setSelectedSite(newSite.id);
            }}
            size="lg"
            className="grow"
          >
            Create a site
          </Button>
        </div>
      )}
    </div>
  );
};
