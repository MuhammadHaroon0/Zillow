import * as React from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DropdownProps {
  title: string;
  items: { id: string; label: string }[];
  onChange: (value: string) => void;
  value: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  title,
  items,
  onChange,
  value,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="font-normal">
          {items.find((item) => item.id === value)?.label}
          <RiArrowDropDownLine />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{title}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(value) => onChange(value)}
        >
          {items?.map((item) => (
            <DropdownMenuRadioItem
              key={item.id}
              value={item.id}
              onClick={() => onChange(item.id)}
            >
              {item.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
