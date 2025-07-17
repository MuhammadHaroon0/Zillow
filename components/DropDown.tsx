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
import { Input } from "@/components/ui/input";

interface DropdownProps {
  title: string;
  items: { id: string; label: string }[];
  onChange: (value: string) => void;
  value: string;
  label?: string;
  placeholder?: string;
  searchable?: boolean;
  disabled?: boolean;
}

export const Dropdown: React.FC<DropdownProps> = ({
  title,
  items,
  onChange,
  value,
  placeholder,
  searchable = false,
  disabled = false,
}) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);

  // Filter items based on search term
  const filteredItems = React.useMemo(() => {
    if (!searchable || !searchTerm) return items;
    return items.filter((item) =>
      item.label
        .replaceAll(",", "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm, searchable]);

  // Reset search when dropdown closes
  React.useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
    }
  }, [isOpen]);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="font-normal" disabled={disabled}>
          {items.find((item) => item.id === value)?.label || placeholder}
          <RiArrowDropDownLine />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{title}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {searchable && (
          <>
            <div className="px-2 py-1">
              <Input
                placeholder="Search options..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8 text-sm"
                onKeyDown={(e) => e.stopPropagation()}
              />
            </div>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(value) => onChange(value)}
        >
          {filteredItems?.length > 0 ? (
            filteredItems.map((item) => (
              <DropdownMenuRadioItem
                key={item.id}
                value={item.id}
                onClick={() => onChange(item.id)}
              >
                {item.label}
              </DropdownMenuRadioItem>
            ))
          ) : (
            <div className="px-2 py-2 text-sm text-gray-500 text-center">
              No options found
            </div>
          )}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
