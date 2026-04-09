"use client"

import * as React from "react"
import { addDays, format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { type DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Field } from "@/components/ui/field"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type Props = {
  name: string
  dateFrom?: string | null;
  dateTo?: string | null;
  onChangeDateFrom: (value: string ) => void;
  onChangeDateTo: (value: string ) => void;
}

export function DatePickerWithRange({
  name,
  dateFrom,
  dateTo,
  onChangeDateFrom,
  onChangeDateTo
}: Props) {
  const date = React.useMemo(() => {
    if (!dateFrom) return undefined;
    return {
      from: new Date(dateFrom),
      to: dateTo ? new Date(dateTo) : undefined,
    };
  }, [dateFrom, dateTo]);

  // useEffect(() => {
  //   onChangeDateFrom(date?.from ? format(date?.from, "yyyy-MM-dd") : "")
  //   onChangeDateTo(date?.to ? format(date?.to, "yyyy-MM-dd") : "")
  // }, [date])

  const handleDateChange = (dates: DateRange | undefined) => {
    onChangeDateFrom(dates?.from ? format(dates?.from, "yyyy-MM-dd") : "");
    onChangeDateTo(dates?.to ? format(dates?.to, "yyyy-MM-dd") : "");
  }

  return (
    <Field className="w-full">
      {/* <FieldLabel htmlFor="date-picker-range">{name}</FieldLabel> */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date-picker-range"
            className="justify-start px-2.5 font-normal w-full"
          >
            <CalendarIcon />
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
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </Field>
  )
}
