import { useSites } from "../hooks";
import { useAppState } from "./app";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export const SiteSelect: React.FC = () => {
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
  );
};
