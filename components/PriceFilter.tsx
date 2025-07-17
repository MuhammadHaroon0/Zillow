import React, { useEffect, useState } from "react";
import { Select, SelectItem } from "./ui/select";
import { maxPrice, minPrice } from "@/lib/filterItems";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import { RiArrowDropDownLine } from "react-icons/ri";
import { Button } from "./ui/button";

const PriceFilter = (props: any) => {
  const [isOpen, setIsOpen] = useState(false);

  const [price, setPrice] = useState<{ min: string; max: string }>({
    min: "",
    max: "",
  });

  const handlePriceChange = (value: string, type: "min" | "max") => {
    setPrice({ ...price, [type]: value });
  };

  const handleApply = () => {
    props.onChange(`${price.min}-${price.max}`);
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
                Min Price
              </label>
              <Select
                value={price.min}
                onValueChange={(value) => handlePriceChange(value, "min")}
                placeholder="Min Price"
                className="w-full"
              >
                {minPrice.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Price
              </label>
              <Select
                value={price.max}
                onValueChange={(value) => handlePriceChange(value, "max")}
                placeholder="Max Price"
                className="w-full"
              >
                {maxPrice.map((option) => (
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
            disabled={!price.min || !price.max}
          >
            Apply
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PriceFilter;
