
'use client';

import * as React from "react";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerWithRangeProps {
  className?: string;
  onSelect: (dateRange: DateRange | undefined) => void; // Add this prop
}

export function DatePickerWithRange({
  className,
  onSelect,
}: DatePickerWithRangeProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(undefined);


  const convertToUTC = (date: Date) => {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  };


  React.useEffect(() => {
    if (date) {
      const adjustedDateRange: DateRange = {
        from: date.from ? convertToUTC(date.from) : undefined,
        to: date.to ? convertToUTC(date.to) : undefined,
      };
      onSelect(adjustedDateRange);
    } else {
      onSelect(undefined); 
    }
  }, [date, onSelect]);

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pilih Tanggal</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(range) => setDate(range ?? undefined)} // Update local state
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
