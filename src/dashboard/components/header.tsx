import { MenuIcon } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Link } from "@tanstack/react-router";
import { useCallback } from "react";
import { useLogOut } from "../hooks/useLogOut";
import { pages } from "../pages";

export const Header: React.FC<
  React.PropsWithChildren<{
    rightChildren?: React.ReactNode;
  }>
> = ({ children, rightChildren }) => {
  const logOut = useLogOut();
  const handleLogOut = useCallback(async () => {
    await logOut();
  }, [logOut]);
  return (
    <div className="flex gap-2 content-baseline mb-4">
      {children}
      <div className="grow"></div>
      {rightChildren}
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="ghost" size="icon">
            <MenuIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            {pages
              .filter((page) => !page.hidden)
              .map((page) => (
                <LinkItem href={page.url}>{page.name}</LinkItem>
              ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={handleLogOut}>Log out</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const LinkItem: React.FC<
  React.PropsWithChildren<{
    href: string;
  }>
> = ({ href, children }) => {
  return (
    <DropdownMenuItem asChild disabled={window.location.pathname === href}>
      <Link to={href}>{children}</Link>
    </DropdownMenuItem>
  );
};
