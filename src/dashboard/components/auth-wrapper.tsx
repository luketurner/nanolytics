import { useSession } from "../hooks/useSession";
import { LoginPage } from "./login-page";

export const AuthWrapper: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { session } = useSession();

  if (!session) {
    return <LoginPage />;
  }
  return children;
};
