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
import { SettingsPage } from "./settings-page";
import { ExpiredPasswordPage } from "./expired-password-page";

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

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: () => (
    <AuthWrapper>
      <SettingsPage />
    </AuthWrapper>
  ),
});

const expiredPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/user/expired",
  component: () => (
    <AuthWrapper>
      <ExpiredPasswordPage />
    </AuthWrapper>
  ),
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: () => <LoginPage />,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  userRoute,
  settingsRoute,
  expiredPasswordRoute,
]);
const router = createRouter({ routeTree });

export const Router = () => {
  return <RouterProvider router={router} />;
};
