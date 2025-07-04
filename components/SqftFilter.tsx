import React, { useEffect, useState } from "react";
import { Select, SelectItem } from "./ui/select";
import { maxPrice, minPrice, propertySize } from "@/lib/filterItems";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import { RiArrowDropDownLine } from "react-icons/ri";
import { Button } from "./ui/button";

const SqftFilter = (props: any) => {
  const [isOpen, setIsOpen] = useState(false);

  const [sqft, setSqft] = useState<{ min: string; max: string }>({
    min: "",
    max: "",
  });

  const handleSqftChange = (value: string, type: "min" | "max") => {
    setSqft({ ...sqft, [type]: value });
  };

  const handleApply = () => {
    props.onChange(`${sqft.min}-${sqft.max}`);
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild disabled={props.disabled}>
        <Button
          variant="outline"
          className="font-normal"
          disabled={props.disabled}
        >
          {props.title}
          <RiArrowDropDownLine />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-80">
        <DropdownMenuLabel>{props.title}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="p-4">
          <div className="flex gap-4 ">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Sqft
              </label>
              <Select
                value={sqft.min}
                onValueChange={(value) => handleSqftChange(value, "min")}
                placeholder="Min Sqft"
                className="w-full"
              >
                {propertySize.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Sqft
              </label>
              <Select
                value={sqft.max}
                onValueChange={(value) => handleSqftChange(value, "max")}
                placeholder="Max Sqft"
                className="w-full"
              >
                {propertySize.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>
          <Button
            onClick={handleApply}
            className="px-4 py-2 bg-blue-600 w-full mt-4 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer ho"
            disabled={!sqft.min || !sqft.max}
          >
            Apply
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SqftFilter;
