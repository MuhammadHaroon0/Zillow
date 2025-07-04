"use client";

import * as React from "react";
import { ChevronDownIcon, CheckIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { cn } from "@/lib/utils";

interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  children: React.ReactNode;
  className?: string;
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
}

const SelectContext = React.createContext<{
  value?: string;
  onValueChange?: (value: string) => void;
}>({});

function Select({
  value,
  onValueChange,
  placeholder,
  children,
  className,
}: SelectProps) {
  const [open, setOpen] = React.useState(false);

  const handleValueChange = (newValue: string) => {
    onValueChange?.(newValue);
    setOpen(false);
  };

  // Find the selected label by extracting it from children
  const selectedLabel = React.useMemo(() => {
    let label = placeholder;
    React.Children.forEach(children, (child) => {
      if (
        React.isValidElement<SelectItemProps>(child) &&
        child.props.value === value
      ) {
        label = child.props.children as string;
      }
    });
    return label;
  }, [children, value, placeholder]);

  return (
    <SelectContext.Provider value={{ value, onValueChange: handleValueChange }}>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
          >
            <span className={cn(!value && "text-muted-foreground")}>
              {selectedLabel}
            </span>
            <ChevronDownIcon className="h-4 w-4 opacity-50" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full min-w-[var(--radix-dropdown-menu-trigger-width)]">
          {children}
        </DropdownMenuContent>
      </DropdownMenu>
    </SelectContext.Provider>
  );
}

function SelectItem({ value, children }: SelectItemProps) {
  const context = React.useContext(SelectContext);
  const isSelected = context.value === value;

  const handleSelect = () => {
    context.onValueChange?.(value);
  };

  return (
    <DropdownMenuItem onSelect={handleSelect} className="cursor-pointer">
      <div className="flex items-center w-full">
        <span className="flex-1">{children}</span>
        {isSelected && <CheckIcon className="h-4 w-4" />}
      </div>
    </DropdownMenuItem>
  );
}

export { Select, SelectItem };
