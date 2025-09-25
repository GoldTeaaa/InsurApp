// RHFDatePicker.tsx
'use client';

import { Controller, useFormContext, type FieldValues, type Path } from 'react-hook-form';
import { useMemo, useRef, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format, parse, isValid, addMinutes } from 'date-fns';

type Props<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  placeholder?: string;
  withTime?: boolean;                 // shows an HH:mm input and stores "YYYY-MM-DDTHH:mm"
  minDate?: Date;
  maxDate?: Date;
  disabledDays?: Date[];              // explicit dates to disable
  disabled?: boolean;
  /**
   * How value is stored in your form:
   *  - 'date'   -> "YYYY-MM-DD"
   *  - 'iso'    -> "YYYY-MM-DDTHH:mm"
   */
  storeAs?: 'date' | 'iso';
};

function formatForInput(d: Date | null, withTime: boolean, storeAs: 'date' | 'iso') {
  if (!d) return '';
  if (withTime || storeAs === 'iso') return format(d, "yyyy-MM-dd'T'HH:mm");
  return format(d, 'yyyy-MM-dd');
}

function parseFromInput(v: string, withTime: boolean): Date | null {
  if (!v) return null;
  const fmt = withTime ? "yyyy-MM-dd'T'HH:mm" : 'yyyy-MM-dd';
  const d = parse(v, fmt, new Date());
  return isValid(d) ? d : null;
}

export function WorldClassDatePicker<T extends FieldValues>({
  name,
  label,
  placeholder = 'Select date',
  withTime = false,
  minDate,
  maxDate,
  disabledDays = [],
  disabled = false,
  storeAs = 'date',
}: Props<T>) {
  const { control } = useFormContext<T>();
  const [open, setOpen] = useState(false);
  const popRef = useRef<HTMLDivElement | null>(null);

  // Build disabled matchers for DayPicker (min/max + explicit days)
  const disabledMatchers = useMemo(() => {
    const rules: any[] = [];
    if (minDate) rules.push({ before: minDate });
    if (maxDate) rules.push({ after: maxDate });
    if (disabledDays.length) rules.push(...disabledDays.map(d => ({ from: d, to: d })));
    return rules;
  }, [minDate, maxDate, disabledDays]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        // Map form value (string/null) -> Date | null
        const valueString = (field.value ?? '') as string;
        const selectedDate = useMemo(
          () => parseFromInput(valueString, withTime || storeAs === 'iso'),
          // eslint-disable-next-line react-hooks/exhaustive-deps
          [valueString, withTime, storeAs]
        );

        const writeValue = (d: Date | null) => {
          if (!d) {
            field.onChange('');
            return;
          }
          // If withTime but time not set yet, default to 00:00
          const normalized = withTime || storeAs === 'iso' ? d : d;
          field.onChange(formatForInput(normalized, withTime, storeAs));
        };

        const onPick = (d?: Date) => {
          if (!d) return;
          // Clamp within min/max
          if (minDate && d < minDate) d = minDate;
          if (maxDate && d > maxDate) d = maxDate;

          // If withTime and current value has time, keep that time
          if (withTime || storeAs === 'iso') {
            const existing = parseFromInput(valueString, true);
            if (existing) {
              // keep HH:mm from existing
              const minutes = existing.getHours() * 60 + existing.getMinutes();
              d = addMinutes(new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0), minutes);
            }
          }

          writeValue(d);
          setOpen(false);
        };

        const onChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
          const raw = e.target.value;
          const parsed = parseFromInput(raw, withTime || storeAs === 'iso');
          if (parsed || raw === '') field.onChange(raw);
        };

        const onChangeTime = (e: React.ChangeEvent<HTMLInputElement>) => {
          const t = e.target.value; // "HH:mm"
          if (!selectedDate) {
            // if time changed before date chosen, do nothing until date is set
            field.onChange('');
            return;
          }
          const [hh, mm] = t.split(':').map(Number);
          const d = new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            Number.isFinite(hh) ? hh : 0,
            Number.isFinite(mm) ? mm : 0
          );
          writeValue(d);
        };

        const timeString =
          selectedDate ? format(selectedDate, 'HH:mm') : '';

        return (
          <div className="w-full">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {label}
            </label>

            <div className="relative">
              <div className="flex items-center gap-2">
                <input
                  type={withTime || storeAs === 'iso' ? 'datetime-local' : 'date'}
                  value={formatForInput(selectedDate, withTime || storeAs === 'iso', storeAs)}
                  onChange={onChangeText}
                  onBlur={field.onBlur}
                  disabled={disabled}
                  placeholder={placeholder}
                  className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 ${
                    error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setOpen(o => !o)}
                  disabled={disabled}
                  aria-label="Open calendar"
                  className="rounded-md border border-gray-300 px-2 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
                >
                  📅
                </button>
                {valueString && (
                  <button
                    type="button"
                    onClick={() => writeValue(null)}
                    disabled={disabled}
                    className="rounded-md border border-gray-300 px-2 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Popover */}
              {open && (
                <div
                  ref={popRef}
                  className="absolute z-50 mt-2 w-[20rem] rounded-lg border border-gray-200 bg-white p-2 shadow-lg"
                >
                  <DayPicker
                    mode="single"
                    selected={selectedDate ?? undefined}
                    onSelect={onPick}
                    disabled={disabledMatchers}
                    fromDate={minDate}
                    toDate={maxDate}
                    weekStartsOn={1}
                    captionLayout="dropdown"
                  />
                  {(withTime || storeAs === 'iso') && (
                    <div className="mt-2 flex items-center gap-2 border-t pt-2">
                      <span className="text-sm text-gray-600">Time</span>
                      <input
                        type="time"
                        value={timeString}
                        onChange={onChangeTime}
                        className="w-[7.5rem] rounded-md border border-gray-300 px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {error && (
              <p className="mt-1 text-sm text-red-600">{error.message}</p>
            )}
          </div>
        );
      }}
    />
  );
}
