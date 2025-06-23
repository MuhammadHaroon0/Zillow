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
}

export const Dropdown: React.FC<DropdownProps> = ({
  title,
  items,
  onChange,
}) => {
  const [selectedItem, setSelectedItem] = React.useState(
    items[0] || {
      id: "",
      label: "",
    }
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="font-normal">
          {selectedItem.label}
          <RiArrowDropDownLine />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{title}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={selectedItem.id}
          onValueChange={(value) =>
            setSelectedItem(
              items?.find((item) => item.id === value) || {
                id: "",
                label: "",
              }
            )
          }
        >
          {items.map((item) => (
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
