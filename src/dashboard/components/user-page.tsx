import { Link } from "@tanstack/react-router";
import { Container } from "./container";
import { Header } from "./header";
import { Button } from "./ui/button";
import { PasswordChangeForm } from "./password-change-form";

export const UserPage: React.FC = () => {
  return (
    <Container>
      <Header>
        <Button asChild variant="ghost">
          <Link to="/">Back</Link>
        </Button>
      </Header>
      <h2>Change Password</h2>
      <PasswordChangeForm />
    </Container>
  );
};
