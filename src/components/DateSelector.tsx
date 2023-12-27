import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "./ui/calendar";
import { useState } from "react";
import { Button } from "./ui/button";
import { format } from "date-fns";
import { HiChevronDown } from "react-icons/hi";

interface Props {
  onDateSelected?: (newDate: string) => void;
}

const DateSelector = (props: Props) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  // const [dateChanged, setDateChanged] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const changeDate = (date: any) => {
    if (date !== selectedDate) {
      console.log("today date", selectedDate, date);
      setSelectedDate(date);
      // setDateChanged(true);
      setIsOpen(false);
      if (props.onDateSelected) {
        props.onDateSelected(format(selectedDate, "PPP"));
      }
    }
  };

  return (
    <div className="flex">
      <Popover open={isOpen}>
        <PopoverTrigger asChild>
          <Button
            onClick={() => setIsOpen(true)}
            variant="outline"
            className="flex gap-2 border border-gray-400"
          >
            <span className="inline-flex">{format(selectedDate, "PPP")}</span>
            <HiChevronDown />
          </Button>
          {/* <Button variant="outline">
            {dateChanged && selectedDate
              ? format(selectedDate, 'PPP')
              : 'Change Date'}
          </Button> */}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={changeDate}
            disabled={(date) =>
              date > new Date() || date < new Date("1900-01-01")
            }
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateSelector;
