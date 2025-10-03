import { Controller, FieldValues, Path, useFormContext } from "react-hook-form";

type Props<T extends FieldValues> = {
    name: Path<T>;
    label: string;
}

export default function CalculatedTextField<T extends FieldValues>({ name, label, ...props }: Props<T>) {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <div>
                    <label>{label}</label>
                    <input
                        {...field}
                        {...props}
                        value={field.value ? field.value : ""}
                        readOnly
                        className="block w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none cursor-not-allowed focus:outline-none" // Adjusted styling for read-only
                    />
                    {error && <p className="text-red-600">{error.message}</p>}
                </div>
            )}
        />
    )
}