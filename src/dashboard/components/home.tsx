import { CogIcon } from "lucide-react";
import { useAppState } from "./app";
import { Container } from "./container";
import { Header } from "./header";
import { LookbackChooser } from "./lookback-chooser";
import { SiteMetrics } from "./site-metrics";
import { SiteSelect } from "./site-select";

export const Home = () => {
  const [appState] = useAppState();

  return (
    <Container>
      <Header rightChildren={<LookbackChooser />}>
        <SiteSelect />
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
