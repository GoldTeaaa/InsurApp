import { Controller, useFormContext, type FieldValues, type Path } from "react-hook-form";

type Props<T extends FieldValues> = {
  name: Path<T>;
  label: string;
};

export default function DateField<T extends FieldValues>({
  name,
  label,
}: Props<T>) {
  const { control } = useFormContext<T>();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <div>
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-gray-700">{label}</label>
            <input
              type="date"
              value={
                (field.value as unknown) instanceof Date ? field.value.toISOString().split("T")[0]
                  : typeof field.value === "string"
                    ? field.value.split("T")[0]
                    : ""
              }
              onChange={field.onChange}
              onBlur={field.onBlur}
              className={`rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? "border-red-500 focus:ring-red-500" : "border-gray-300"
                }`}
            />  
          </div>
          <div>
            {error && <span className="text-sm text-red-600">{error.message}</span>}
          </div>
        </div>
      )}
    />
  );
}
