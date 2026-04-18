import {
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { Home } from "./home";
import { LoginPage } from "./login-page";
import { AuthWrapper } from "./auth-wrapper";
import { UserPage } from "./user-page";

const rootRoute = createRootRoute();

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => (
    <AuthWrapper>
      <Home />
    </AuthWrapper>
  ),
});

const userRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/user",
  component: () => (
    <AuthWrapper>
      <UserPage />
    </AuthWrapper>
  ),
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: () => <LoginPage />,
});

const routeTree = rootRoute.addChildren([indexRoute, loginRoute, userRoute]);
const router = createRouter({ routeTree });

export const Router = () => {
  return <RouterProvider router={router} />;
};
