import { useCallback } from "react";
import { useAppState } from "./app";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export const LookbackChooser = () => {
  const [appState, setAppState] = useAppState();
  const handleLookbackChange = useCallback(
    async (newValue: number) => {
      setAppState({ ...appState, lookback: newValue });
    },
    [setAppState]
  );
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="outline">Lookback ({appState.lookback}d)</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleLookbackChange(1)}>
          1d
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLookbackChange(7)}>
          7d
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLookbackChange(30)}>
          30d
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLookbackChange(365)}>
          365d
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
