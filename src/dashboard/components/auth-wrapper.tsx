import { Navigate } from "@tanstack/react-router";
import { useSession } from "../hooks/useSession";

export const AuthWrapper: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { session } = useSession();

  if (!session) {
    return <Navigate to="/login" />;
  }
  return children;
};
