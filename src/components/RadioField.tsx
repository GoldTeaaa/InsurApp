import { Controller, useFormContext, type FieldValues, type Path } from "react-hook-form";

type Props<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  options: readonly string[];
};

export function RadioField<T extends FieldValues>({
  name,
  label,
  options,
}: Props<T>) {
  const { control } = useFormContext<T>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="flex flex-col space-y-2">
          <span className="text-base font-medium text-gray-800">{label}</span>
          <div className="flex flex-wrap gap-6">
            {options.map((option) => (
              <label
                key={option}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  value={option}
                  checked={field.value === option}
                  onChange={() => field.onChange(option)}
                  className="h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-base text-gray-800">{option}</span>
              </label>
            ))}
          </div>
          {error && (
            <p className="text-sm text-red-600">{error.message}</p>
          )}
        </div>
      )}
    />
  );

}
