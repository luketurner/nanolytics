import { useCallback, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { ButtonGroup } from "./ui/button-group";

export const FilterSelect: React.FC<{
  items: Array<{ label: string; value: string }>;
  onChange: (v: string) => void;
  value: string;
  placeholder?: string;
}> = ({ items, onChange, value, placeholder }) => {
  const handleChange = useCallback(
    (newId: string) => {
      onChange(newId);
    },
    [onChange],
  );

  const handleClear = useCallback(() => {
    onChange("");
  }, [onChange]);

  return (
    <ButtonGroup>
      <Select value={value} onValueChange={handleChange}>
        <SelectTrigger className="w-28">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {items.map(({ label, value }) => (
            <SelectItem value={value}>{label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        variant="outline"
        size="icon"
        onClick={handleClear}
        disabled={!value}
      >
        <X />
      </Button>
    </ButtonGroup>
  );
};
