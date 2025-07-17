import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "./ui/checkbox";
import { MdOutlineTune } from "react-icons/md";
import { useFilterStore } from "@/store/filterStates";

const items = [
  // { id: "Distance", label: "Distance" },
  { id: "bedrooms", label: "Bedrooms" },
  { id: "price", label: "Price (Listed/Sold)" },
  { id: "livingArea", label: "Square Footage" },
  { id: "listingStatus", label: "Status (On Sale/Sold)" },
  // { id: "YearBuilt", label: "Year Built" },
  { id: "bathrooms", label: "Bathrooms" },
  { id: "address", label: "Address" },
] as const;

export const FilterComponent = () => {
  const { toggleSelection, selectedState } = useFilterStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="font-normal">
          <MdOutlineTune className="text-lg" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Customize Columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {items.map((item) => {
          const isChecked = selectedState.includes(item.id);
          return (
            <div
              key={item.id}
              className="flex items-center gap-3 w-full px-2 py-1 cursor-pointer"
              onClick={() => toggleSelection(item.id, !isChecked)}
            >
              <Checkbox checked={isChecked} />
              <span className="text-md">{item.label}</span>
            </div>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
