import { Controller, FieldValues, Path, useFormContext } from "react-hook-form";

type Props<T extends FieldValues> = {
    name: Path<T>;
    label: string;
    type?: string;
    defaultValue?: string;
    step?: string;
}

export default function FormTextField<T extends FieldValues>({ name, label, defaultValue, type, step, ...props }: Props<T>) {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({field, fieldState: { error }}) => (
                <div>
                    <label>{label}</label>
                    <input
                        {...field}
                        {...props}
                        value={field.value ? field.value : ""}
                        onChange={(e) => {
                            if (type === 'number') {
                                field.onChange(e.target.value);
                            } else {
                                field.onChange(e);
                            }
                        }}
                        defaultValue={defaultValue}
                        aria-invalid={!!error}
                        type={type}
                        step={step}
                        className={[
                            "block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none",
                            "focus:border-blue-600 focus:ring-1 focus:ring-blue-600",
                            "disabled:cursor-not-allowed disabled:opacity-50",
                        ].join(" ")}
                    />
                    {error && <p className="text-red-600">{error.message}</p>}
                </div>
            )}
        />
    )
}