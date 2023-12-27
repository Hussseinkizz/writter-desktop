"use client";

import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

const landlords = [
  {
    value: "kizz",
    label: "Kizz",
  },
  {
    value: "isaac",
    label: "Isaac",
  },
  {
    value: "timo",
    label: "Timo",
  },
  {
    value: "tom",
    label: "Tom",
  },
  {
    value: "dauglas",
    label: "Dauglas",
  },
];

export const Combobox = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? landlords.find((landlord) => landlord.value === value)?.label
            : "Select Landlord..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search Landlord..." className="h-9" />
          <CommandEmpty>No Landlord found.</CommandEmpty>
          <CommandGroup>
            {landlords.map((landlord) => (
              <CommandItem
                key={landlord.value}
                value={landlord.value}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
              >
                {landlord.label}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    value === landlord.value ? "opacity-100" : "opacity-0",
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
