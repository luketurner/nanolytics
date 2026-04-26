import { useNavigate } from "@tanstack/react-router";
import { Container } from "./container";
import { PasswordChangeForm } from "./password-change-form";
import { useCallback } from "react";

export const ExpiredPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const handleSubmit = useCallback(async () => {
    await navigate({ to: "/" });
  }, [navigate]);
  return (
    <Container>
      <h2>You Must Change Your Password</h2>
      <PasswordChangeForm onSubmit={handleSubmit} />
    </Container>
  );
};
