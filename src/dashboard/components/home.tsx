import { useEvents } from "../hooks";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";

export const Home = () => {
  const { data: events } = useEvents();
  return (
    <>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink>Link</NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <ul>
        {events?.map((e) => (
          <li>{JSON.stringify(e)}</li>
        ))}
      </ul>
    </>
  );
};
