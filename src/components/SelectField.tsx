import { Controller, useFormContext, type FieldValues, type Path } from "react-hook-form";

type Props<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  options: readonly string[];
};

export function SelectField<T extends FieldValues>({
  name,
  label,
  options,
}: Props<T>) {
  const { control } = useFormContext<T>();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <div className="flex flex-col space-y-1">
          <label>{label}</label>
          <select
            name={field.name}
            value={field.value ?? ""}
            onChange={field.onChange}
            onBlur={field.onBlur}
            className={`rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? "border-red-500 focus:ring-red-500" : "border-gray-300"
              }`}
          >
            <option value="" disabled>
              -- Pilih {label} --
            </option>
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          {error && <span className="text-sm text-red-600">{error.message}</span>}
        </div>
      )}
    />
  );
}
