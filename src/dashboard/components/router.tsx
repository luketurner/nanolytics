import {
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
  type RouteComponent,
} from "@tanstack/react-router";
import { Home } from "./home";
import { LoginPage } from "./login-page";
import { AuthWrapper } from "./auth-wrapper";
import { UserPage } from "./user-page";
import { SettingsPage } from "./settings-page";
import { ExpiredPasswordPage } from "./expired-password-page";
import { EventsPage } from "./events-page";
import type { PageUrl } from "../pages";

const rootRoute = createRootRoute();

const pageComponents: Record<PageUrl, RouteComponent> = {
  "/": () => (
    <AuthWrapper>
      <Home />
    </AuthWrapper>
  ),
  "/user": () => (
    <AuthWrapper>
      <UserPage />
    </AuthWrapper>
  ),
  "/settings": () => (
    <AuthWrapper>
      <SettingsPage />
    </AuthWrapper>
  ),
  "/user/expired": () => (
    <AuthWrapper>
      <ExpiredPasswordPage />
    </AuthWrapper>
  ),
  "/events": () => (
    <AuthWrapper>
      <EventsPage />
    </AuthWrapper>
  ),
  "/login": () => <LoginPage />,
};

const routeTree = rootRoute.addChildren(
  Object.entries(pageComponents).map(([path, component]) =>
    createRoute({
      getParentRoute: () => rootRoute,
      path,
      component,
    }),
  ),
);
const router = createRouter({ routeTree });

export const Router = () => {
  return <RouterProvider router={router} />;
};
