import { Controller, FieldValues, Path, useFormContext } from "react-hook-form";

type Props<T extends FieldValues> = {
    name: Path<T>;
    label: string;
    type?: string;
    defaultValue?: string;
    step?: string;
    min?: string;
    max?: string;
    readOnly?: boolean;
    disabled?: boolean;
}

export default function FormTextField<T extends FieldValues>({
    name, label, defaultValue, type, step, readOnly, disabled, ...props }: Props<T>) {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <div>
                    <label>{label}</label>
                    {readOnly && <p className="text-blue-600 text-sm mt-1">Tidak bisa diubah</p>}
                    <input
                        {...field}
                        {...props}
                        value={field.value ? field.value : ""}
                        onChange={(e) => {
                            //Wrap to number for 
                            if (type === 'number') {
                                field.onChange(Number(e.target.value));
                            } else {
                                field.onChange(e.target.value);
                            }
                        }}
                        defaultValue={defaultValue}
                        aria-invalid={!!error}
                        type={type}
                        step={step}
                        min={props.min}
                        max={props.max}
                        readOnly={readOnly}
                        disabled={disabled}
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