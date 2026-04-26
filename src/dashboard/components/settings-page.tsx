import { Link } from "@tanstack/react-router";
import { Container } from "./container";
import { Header } from "./header";
import { Button } from "./ui/button";
import { Settings } from "./settings";

export const SettingsPage: React.FC = () => {
  return (
    <Container>
      <Header>
        <Button asChild variant="ghost">
          <Link to="/">Back</Link>
        </Button>
      </Header>
      <Settings />
    </Container>
  );
};
